"""Fetch reproducible Sentinel-2 true-colour crops for the shoreline timeline.

The script intentionally refuses points without verified WGS84 coordinates. It does
not use the display coordinates from the AMap/GCJ-02 map as a silent substitute.
"""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path

import numpy as np
import planetary_computer
import rasterio
from PIL import Image
from pystac_client import Client
from rasterio.enums import Resampling
from rasterio.warp import transform_bounds
from rasterio.windows import from_bounds


ROOT = Path(__file__).resolve().parents[2]
GEO_PATH = ROOT / "src" / "data" / "geo.json"
CATALOG_URL = "https://planetarycomputer.microsoft.com/api/stac/v1"
COLLECTION = "sentinel-2-l2a"
YEARS = range(2016, 2022)
AUTUMN_WINDOW = ("09-01", "12-15")
OUTPUT_SIZE = (1400, 800)
BBOX_HALF_HEIGHT = 0.012


def load_geo() -> dict:
    return json.loads(GEO_PATH.read_text(encoding="utf-8"))


def point_bbox(point: dict) -> list[float]:
    lat = point.get("wgs84Lat")
    lng = point.get("wgs84Lng")
    if lat is None or lng is None:
        raise ValueError(
            f"{point['id']} has no verified WGS84 coordinates. "
            "Set wgs84Lat and wgs84Lng in src/data/geo.json before downloading."
        )
    # Keep the output's 16:9 ground footprint approximately consistent at this latitude.
    half_width = BBOX_HALF_HEIGHT * (OUTPUT_SIZE[0] / OUTPUT_SIZE[1]) / math.cos(math.radians(lat))
    return [lng - half_width, lat - BBOX_HALF_HEIGHT, lng + half_width, lat + BBOX_HALF_HEIGHT]


def find_best_item(catalog: Client, bbox: list[float], year: int):
    start = f"{year}-{AUTUMN_WINDOW[0]}"
    end = f"{year}-{AUTUMN_WINDOW[1]}"
    search = catalog.search(
        collections=[COLLECTION],
        bbox=bbox,
        datetime=f"{start}/{end}",
        query={"eo:cloud_cover": {"lt": 65}},
    )
    items = list(search.items())
    if not items:
        return None
    return min(items, key=lambda item: item.properties.get("eo:cloud_cover", 100))


def read_band(asset_href: str, bbox: list[float]) -> np.ndarray:
    with rasterio.open(asset_href) as src:
        source_bbox = transform_bounds("EPSG:4326", src.crs, *bbox, densify_pts=21)
        window = from_bounds(*source_bbox, transform=src.transform)
        return src.read(
            1,
            window=window,
            out_shape=(OUTPUT_SIZE[1], OUTPUT_SIZE[0]),
            resampling=Resampling.bilinear,
            boundless=True,
            fill_value=0,
        )


def true_colour_image(item, bbox: list[float]) -> Image.Image:
    signed_item = planetary_computer.sign(item)
    bands = [read_band(signed_item.assets[band].href, bbox) for band in ("B04", "B03", "B02")]
    rgb = np.stack(bands, axis=-1).astype(np.float32)
    # Sentinel-2 reflectance uses a 0-10000 scale. A fixed 0-3000 stretch keeps
    # annual renderings comparable instead of applying a different per-image boost.
    rgb = np.clip((rgb / 3000.0) * 255.0, 0, 255).astype(np.uint8)
    return Image.fromarray(rgb, mode="RGB")


def entry_from_item(item, image_path: str) -> dict:
    props = item.properties
    acquired = props.get("datetime", "")
    return {
        "year": int(acquired[:4]),
        "image": image_path,
        "date": acquired[:10],
        "dateRange": "",
        "source": "Sentinel-2 L2A",
        "productId": item.id,
        "cloudCover": props.get("eo:cloud_cover"),
        "processing": "单景真彩色，固定 0-3000 反射率拉伸",
        "attribution": "Contains modified Copernicus Sentinel data via Microsoft Planetary Computer.",
        "sourcePage": f"https://planetarycomputer.microsoft.com/dataset/{COLLECTION}",
        "note": "影像按秋季窗口和场景云量筛选；可见变化仍需结合水文资料和实地调查判断。",
    }


def update_timeline(point: dict, entries: dict[int, dict]) -> None:
    timeline = []
    for year in YEARS:
        existing = next((item for item in point.get("timeline", []) if item.get("year") == year), {"year": year})
        timeline.append(entries.get(year, existing))
    point["timeline"] = timeline


def process_point(catalog: Client, point: dict, dry_run: bool) -> list[dict]:
    bbox = point_bbox(point)
    downloaded = {}
    report_rows = []
    for year in YEARS:
        item = find_best_item(catalog, bbox, year)
        if item is None:
            report_rows.append({"point": point["id"], "year": year, "status": "missing"})
            continue

        if dry_run:
            report_rows.append({"point": point["id"], "year": year, "status": "candidate", "productId": item.id, "cloudCover": item.properties.get("eo:cloud_cover")})
            continue

        output_dir = ROOT / "public" / "img" / "satellite" / point["id"]
        output_dir.mkdir(parents=True, exist_ok=True)
        output_path = output_dir / f"{year}.webp"
        true_colour_image(item, bbox).save(output_path, "WEBP", quality=90, method=6)
        image_path = f"/img/satellite/{point['id']}/{year}.webp"
        downloaded[year] = entry_from_item(item, image_path)
        report_rows.append({"point": point["id"], "year": year, "status": "downloaded", **downloaded[year]})

    if not dry_run:
        update_timeline(point, downloaded)
    return report_rows


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch Sentinel-2 history for shoreline points.")
    parser.add_argument("--point", action="append", dest="point_ids", help="Point id to process; repeat for more than one point.")
    parser.add_argument("--dry-run", action="store_true", help="Search candidates only; do not download or change geo.json.")
    args = parser.parse_args()

    geo = load_geo()
    requested = set(args.point_ids or [point["id"] for point in geo["points"]])
    points = [point for point in geo["points"] if point["id"] in requested]
    if not points:
        raise SystemExit("No matching point id found.")

    catalog = Client.open(CATALOG_URL)
    report = []
    for point in points:
        report.extend(process_point(catalog, point, args.dry_run))

    if not args.dry_run:
        GEO_PATH.write_text(json.dumps(geo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    report_path = ROOT / "docs" / "satellite-imagery-manifest.generated.json"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {report_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
