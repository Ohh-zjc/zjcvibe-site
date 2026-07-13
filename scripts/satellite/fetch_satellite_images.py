"""Fetch reproducible Sentinel-2 true-colour crops for the shoreline timeline.

The workflow uses the public Microsoft Planetary Computer STAC and image APIs.
It keeps display coordinates separate from the WGS84 retrieval coordinates.
"""

from __future__ import annotations

import argparse
import json
import math
import os
from io import BytesIO
from pathlib import Path

# This machine may inherit an unwritable D:\sslkey.log. Set a process-local,
# writable location before requests creates its SSL context.
os.environ["SSLKEYLOGFILE"] = str(Path(os.environ.get("TEMP", ".")) / "python-sslkeys.log")

import requests
from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
GEO_PATH = ROOT / "src" / "data" / "geo.json"
CATALOG_SEARCH_URL = "https://planetarycomputer.microsoft.com/api/stac/v1/search"
DATA_API_URL = "https://planetarycomputer.microsoft.com/api/data/v1"
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
            f"{point['id']} has no WGS84 retrieval coordinates. "
            "Set wgs84Lat and wgs84Lng in src/data/geo.json first."
        )
    half_width = BBOX_HALF_HEIGHT * (OUTPUT_SIZE[0] / OUTPUT_SIZE[1]) / math.cos(math.radians(lat))
    return [lng - half_width, lat - BBOX_HALF_HEIGHT, lng + half_width, lat + BBOX_HALF_HEIGHT]


def find_candidates(session: requests.Session, bbox: list[float], year: int) -> list[dict]:
    response = session.post(
        CATALOG_SEARCH_URL,
        json={
            "collections": [COLLECTION],
            "bbox": bbox,
            "datetime": f"{year}-{AUTUMN_WINDOW[0]}/{year}-{AUTUMN_WINDOW[1]}",
            "limit": 100,
        },
        timeout=45,
    )
    response.raise_for_status()
    items = response.json().get("features", [])
    return sorted(items, key=lambda item: item.get("properties", {}).get("eo:cloud_cover", 100))


def render_image(session: requests.Session, item: dict, bbox: list[float]) -> bytes:
    coords = ",".join(f"{value:.7f}" for value in bbox)
    width, height = OUTPUT_SIZE
    url = f"{DATA_API_URL}/item/bbox/{coords}/{width}x{height}.webp"
    params = [
        ("collection", COLLECTION),
        ("item", item["id"]),
        ("assets", "B04"),
        ("assets", "B03"),
        ("assets", "B02"),
        ("rescale", "0,3000"),
    ]
    response = session.get(url, params=params, timeout=120)
    response.raise_for_status()
    if response.headers.get("content-type", "").split(";")[0] != "image/webp":
        raise RuntimeError(f"Unexpected render response for {item['id']}")

    image = Image.open(BytesIO(response.content))
    image.load()
    if image.size != OUTPUT_SIZE:
        raise RuntimeError(f"Unexpected image size {image.size} for {item['id']}")

    # A bbox crossing a Sentinel tile edge can contain black no-data strips.
    # Test a small copy and reject the candidate before it reaches the website.
    sample = image.resize((140, 80))
    pixels = sample.get_flattened_data() if hasattr(sample, "get_flattened_data") else sample.getdata()
    nodata_pixels = sum(1 for pixel in pixels if max(pixel[:3]) <= 2)
    if nodata_pixels / (140 * 80) > 0.001:
        raise RuntimeError(f"Rendered crop contains no-data pixels for {item['id']}")
    return response.content


def entry_from_item(item: dict, image_path: str) -> dict:
    properties = item.get("properties", {})
    acquired = properties.get("datetime", "")
    return {
        "year": int(acquired[:4]),
        "image": image_path,
        "date": acquired[:10],
        "dateRange": "",
        "source": "Sentinel-2 L2A",
        "productId": item["id"],
        "cloudCover": properties.get("eo:cloud_cover"),
        "processing": "单景真彩色，固定 0-3000 反射率拉伸",
        "attribution": "Contains modified Copernicus Sentinel data via Microsoft Planetary Computer.",
        "sourcePage": "https://planetarycomputer.microsoft.com/dataset/sentinel-2-l2a",
        "note": "影像按秋季窗口和场景云量筛选；可见变化仍需结合水文资料和实地调查判断。",
    }


def update_timeline(point: dict, entries: dict[int, dict]) -> None:
    existing_by_year = {entry["year"]: entry for entry in point.get("timeline", [])}
    point["timeline"] = [entries.get(year, existing_by_year.get(year, {"year": year})) for year in YEARS]


def process_point(session: requests.Session, point: dict, dry_run: bool) -> list[dict]:
    bbox = point_bbox(point)
    downloaded = {}
    report_rows = []

    for year in YEARS:
        candidates = find_candidates(session, bbox, year)
        if not candidates:
            print(f"{point['id']} {year}: no candidate")
            report_rows.append({"point": point["id"], "year": year, "status": "missing", "bbox": bbox})
            continue

        if dry_run:
            item = candidates[0]
            properties = item.get("properties", {})
            print(f"{point['id']} {year}: {item['id']} cloud={properties.get('eo:cloud_cover')}")
            report_rows.append({
                "point": point["id"],
                "year": year,
                "status": "candidate",
                "bbox": bbox,
                "productId": item["id"],
                "date": properties.get("datetime", "")[:10],
                "cloudCover": properties.get("eo:cloud_cover"),
            })
            continue

        output_path = ROOT / "public" / "img" / "satellite" / point["id"] / f"{year}.webp"
        item = None
        image_bytes = None
        rejected = []
        for candidate in candidates:
            try:
                image_bytes = render_image(session, candidate, bbox)
                item = candidate
                break
            except (requests.RequestException, RuntimeError) as error:
                rejected.append({"productId": candidate["id"], "reason": str(error)})
        if item is None or image_bytes is None:
            print(f"{point['id']} {year}: no complete crop")
            report_rows.append({"point": point["id"], "year": year, "status": "missing", "bbox": bbox, "rejected": rejected})
            continue

        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_bytes(image_bytes)
        image_path = f"/img/satellite/{point['id']}/{year}.webp"
        downloaded[year] = entry_from_item(item, image_path)
        print(f"{point['id']} {year}: wrote {output_path.relative_to(ROOT)}")
        report_rows.append({
            "point": point["id"],
            "year": year,
            "status": "downloaded",
            "bbox": bbox,
            "rejectedCandidates": rejected,
            **downloaded[year],
        })

    if not dry_run:
        update_timeline(point, downloaded)
    return report_rows


def complete_manifest(geo: dict, latest_rows: list[dict]) -> list[dict]:
    latest_by_key = {(row["point"], row["year"]): row for row in latest_rows}
    manifest = []
    for point in geo["points"]:
        bbox = point_bbox(point)
        for entry in point.get("timeline", []):
            key = (point["id"], entry["year"])
            if key in latest_by_key:
                manifest.append(latest_by_key[key])
                continue
            manifest.append({
                "point": point["id"],
                "year": entry["year"],
                "status": "downloaded" if entry.get("image") else "missing",
                "bbox": bbox,
                **entry,
            })
    return sorted(manifest, key=lambda row: (row["point"], row["year"]))


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch Sentinel-2 history for shoreline points.")
    parser.add_argument("--point", action="append", dest="point_ids", help="Point id to process; repeat for more than one point.")
    parser.add_argument("--dry-run", action="store_true", help="Search candidates only; do not download or change geo.json.")
    parser.add_argument("--manifest-only", action="store_true", help="Rebuild the complete manifest from geo.json without network access.")
    args = parser.parse_args()

    geo = load_geo()
    requested = set(args.point_ids or [point["id"] for point in geo["points"]])
    points = [point for point in geo["points"] if point["id"] in requested]
    if not points:
        raise SystemExit("No matching point id found.")

    report = []
    if not args.manifest_only:
        with requests.Session() as session:
            session.headers.update({"User-Agent": "dongtinghu-social-practice/1.0"})
            for point in points:
                report.extend(process_point(session, point, args.dry_run))

    if not args.dry_run:
        GEO_PATH.write_text(json.dumps(geo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if not args.dry_run:
        report = complete_manifest(geo, report)

    report_path = ROOT / "docs" / "satellite-imagery-manifest.generated.json"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {report_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
