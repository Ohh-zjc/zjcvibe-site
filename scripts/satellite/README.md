# Satellite imagery workflow

This script prepares 2016-2021 true-colour Sentinel-2 L2A crops for the four shoreline investigation points.

1. Verify the source coordinate system for each point.
2. Fill `wgs84Lat` and `wgs84Lng` in `src/data/geo.json`. The script refuses to run when these fields are missing.
3. Create a Python environment and install the dependencies:

```bash
python -m venv .venv
.venv\Scripts\activate
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

The script searches each year from September 1 to December 15, ranks available Sentinel-2 L2A scenes by `eo:cloud_cover`, exports the same 16:9 WGS84 ground footprint for every year of a point and writes WebP files to `public/img/satellite/<point-id>/`. It also updates that point's `timeline` metadata in `src/data/geo.json` and writes a generated manifest under `docs/`.

The current script is deliberately limited to Sentinel-2 L2A. When a year has no suitable scene, it leaves the UI entry as `影像待补充`; do not relabel a missing image as a successful download. A Landsat fallback should be added only with its own band processing and metadata labels.
