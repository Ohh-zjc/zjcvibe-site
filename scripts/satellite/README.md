# Satellite imagery workflow

This script prepares 2016-2021 true-colour Sentinel-2 L2A crops for the four shoreline investigation points. It uses the public Planetary Computer STAC and bbox rendering APIs, so it does not require rasterio, GDAL or full-scene downloads.

1. Verify the source coordinate system for each point.
2. Fill `wgs84Lat` and `wgs84Lng` in `src/data/geo.json`. The script refuses to run when these fields are missing.
3. Check that `requests` and `Pillow` are available. They are already present in the current project Python environment. If needed, install only these lightweight dependencies:

```bash
pip install -r scripts/satellite/requirements.txt
```

4. Inspect candidate scenes first:

```bash
python scripts/satellite/fetch_satellite_images.py --point hualong --dry-run
```

5. Download verified point histories:

```bash
python scripts/satellite/fetch_satellite_images.py --point hualong
```

The script searches each year from September 1 to December 15, except 2020 and 2021 which are intentionally restricted to September 1-30 for seasonal consistency. A point can set `imagerySearchWindow` in `src/data/geo.json` to enforce a different window, such as the September-only history required for 南湖广场公园. It takes up to 20 candidates ordered by STAC `eo:cloud_cover`, measures cloud and shadow classes in the point crop using the Sentinel-2 SCL asset, and renders the clearest local candidate. Candidates with more than 35% local cloud/shadow are rejected rather than displayed as misleading imagery. It exports the same 16:9 WGS84 ground footprint for every year of a point and writes WebP files to `public/img/satellite/<point-id>/`. It also updates that point's `timeline` metadata in `src/data/geo.json` and writes a generated manifest under `docs/`.

Use `--reset-existing` when point coordinates have changed and every historical image must be rebuilt. If a replacement cannot be downloaded, that year stays empty instead of silently retaining imagery from the old location.

Use `--year 2020` to rebuild a specific year without touching the other timeline entries. The option can be repeated for multiple years.

Rebuild the complete manifest without making a network request:

```bash
python scripts/satellite/fetch_satellite_images.py --manifest-only
```

The current script is deliberately limited to Sentinel-2 L2A. When a year has no suitable scene, it leaves the UI entry as `影像待补充`; do not relabel a missing image as a successful download. A Landsat fallback should be added only with its own band processing and metadata labels.
