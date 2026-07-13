# Historical Satellite Imagery Report

## Retrieval Status

The repository contains 24 Sentinel-2 L2A true-colour crops: four investigation points, each covering 2016 through 2021. Every file is a 1400 x 800 WebP rendered from a real STAC product through the public Microsoft Planetary Computer data API.

The complete per-image manifest is generated at `docs/satellite-imagery-manifest.generated.json`. It records the point id, year, WGS84 bbox, acquisition date, product id, source cloud-cover value, processing method, attribution and local image path. This report does not duplicate or manually rewrite those values.

## Coordinate Method

- The existing map positions are retained as GCJ-02 display coordinates for the AMap tiles.
- Separate WGS84 retrieval coordinates were derived with the standard GCJ-02 to WGS84 conversion algorithm.
- These converted coordinates are marked `待现场核验` in `src/data/geo.json`; they are suitable for the current candidate crops but must not be described as survey-grade coordinates.
- Every year for a point uses the same WGS84 centre, approximately 16:9 ground footprint, orientation and output size.

## Scene Selection and Processing

- Catalog: Microsoft Planetary Computer STAC, collection `sentinel-2-l2a`.
- Seasonal search window: September 1 to December 15 for each year.
- Candidate order: ascending STAC `eo:cloud_cover`.
- Quality check: a rendered candidate containing visible no-data pixels is rejected and the next candidate is tried. This corrected tile-edge gaps in the fishery 2016 and 2017 crops.
- Rendering: Sentinel-2 B04/B03/B02 true colour with a fixed 0-3000 reflectance stretch.
- Output: WebP under `public/img/satellite/<point-id>/<year>.webp`.
- Attribution: `Contains modified Copernicus Sentinel data via Microsoft Planetary Computer.`

## Validation

- 24 of 24 expected historical files are present.
- All files decode successfully as RGB images at 1400 x 800.
- All 24 timeline entries contain an image path, acquisition date, data source, product id, cloud-cover value, attribution and source link.
- No black no-data bands remain in the reviewed contact sheet.
- The images show observational context only. Changes may reflect water level, rainfall, season, atmosphere and acquisition conditions; they are not used alone to claim a governance outcome.

## 2026 Field Work Still Required

1. Verify the four point coordinates in the field and record the coordinate device/CRS.
2. Capture the four 2026 aerial images and record date, viewpoint, altitude and whether each image is an orthophoto.
3. Add the field image path and metadata to each point's `current` object in `src/data/geo.json`.
4. Compare imagery with hydrological records and field observations before writing any ecological conclusion.
