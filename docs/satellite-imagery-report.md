# Historical Satellite Imagery Report

## Retrieval Status

On 2026-07-13, the project queried the public Microsoft Planetary Computer STAC API for Sentinel-2 L2A candidate scenes. The search used the existing map display coordinates with a 0.03 degree bbox and an autumn window from September 1 to December 15.

**Important:** the four source coordinates are still marked `待核验（用于当前高德底图显示）`. They may be GCJ-02 display coordinates rather than WGS84. The results below are therefore **candidates only**: no image file has been downloaded, no candidate has been displayed on the public site, and none should be interpreted as a verified point-centred observation until the team supplies WGS84 coordinates.

## Coordinate and Processing Rules

- Map display coordinates are retained unchanged in `src/data/geo.json`.
- `wgs84Lat` and `wgs84Lng` are intentionally empty until their source CRS is verified.
- The downloader refuses to crop imagery without these WGS84 fields.
- Intended output: 1400 x 800 WebP, same fixed WGS84 bbox per point, Sentinel-2 true colour, fixed 0-3000 reflectance stretch.
- Candidate scenes were ranked by STAC `eo:cloud_cover`; the values below are the source metadata values and are not manually edited.
- Source catalog: [Microsoft Planetary Computer Sentinel-2 L2A](https://planetarycomputer.microsoft.com/dataset/sentinel-2-l2a). Attribution after download: `Contains modified Copernicus Sentinel data via Microsoft Planetary Computer.`

## Candidate Scene Manifest

| Point | Year | Acquisition date | Product ID | STAC cloud cover | Status |
| --- | ---: | --- | --- | ---: | --- |
| 华龙码头（江豚湾） | 2016 | 2016-12-09 | S2A_MSIL2A_20161209T031122_R075_T49RFN_20210213T191236 | 0.172966 | 坐标待核验，未下载 |
| 华龙码头（江豚湾） | 2017 | 2017-09-15 | S2A_MSIL2A_20170915T030541_R075_T49RFN_20210202T025712 | 0.126469 | 坐标待核验，未下载 |
| 华龙码头（江豚湾） | 2018 | 2018-10-05 | S2B_MSIL2A_20181005T030549_R075_T49RFN_20201009T082549 | 0.074791 | 坐标待核验，未下载 |
| 华龙码头（江豚湾） | 2019 | 2019-09-30 | S2B_MSIL2A_20190930T030539_R075_T49RFN_20201004T185018 | 0.073022 | 坐标待核验，未下载 |
| 华龙码头（江豚湾） | 2020 | 2020-11-08 | S2A_MSIL2A_20201108T030941_R075_T49RFN_20201110T032049 | 0.090803 | 坐标待核验，未下载 |
| 华龙码头（江豚湾） | 2021 | 2021-09-24 | S2A_MSIL2A_20210924T030551_R075_T49RFN_20210927T055415 | 0.127787 | 坐标待核验，未下载 |
| 城陵矶水文站 | 2016 | 2016-12-09 | S2A_MSIL2A_20161209T031122_R075_T49RGN_20210213T191237 | 0.170976 | 坐标待核验，未下载 |
| 城陵矶水文站 | 2017 | 2017-10-30 | S2B_MSIL2A_20171030T030829_R075_T49RGN_20201015T031316 | 0.108910 | 坐标待核验，未下载 |
| 城陵矶水文站 | 2018 | 2018-10-05 | S2B_MSIL2A_20181005T030549_R075_T49RFN_20201009T082549 | 0.074791 | 坐标待核验，未下载 |
| 城陵矶水文站 | 2019 | 2019-09-30 | S2B_MSIL2A_20190930T030539_R075_T49RFN_20201004T185018 | 0.073022 | 坐标待核验，未下载 |
| 城陵矶水文站 | 2020 | 2020-11-08 | S2A_MSIL2A_20201108T030941_R075_T49RFN_20201110T032049 | 0.090803 | 坐标待核验，未下载 |
| 城陵矶水文站 | 2021 | 2021-09-24 | S2A_MSIL2A_20210924T030551_R075_T49RFN_20210927T055415 | 0.127787 | 坐标待核验，未下载 |
| 东洞庭湖湿地 | 2016 | 2016-12-09 | S2A_MSIL2A_20161209T031122_R075_T49RFN_20210213T191236 | 0.172966 | 坐标待核验，未下载 |
| 东洞庭湖湿地 | 2017 | 2017-09-15 | S2A_MSIL2A_20170915T030541_R075_T49RFN_20210202T025712 | 0.126469 | 坐标待核验，未下载 |
| 东洞庭湖湿地 | 2018 | 2018-10-05 | S2B_MSIL2A_20181005T030549_R075_T49RFN_20201009T082549 | 0.074791 | 坐标待核验，未下载 |
| 东洞庭湖湿地 | 2019 | 2019-09-30 | S2B_MSIL2A_20190930T030539_R075_T49RFN_20201004T185018 | 0.073022 | 坐标待核验，未下载 |
| 东洞庭湖湿地 | 2020 | 2020-11-08 | S2A_MSIL2A_20201108T030941_R075_T49RFN_20201110T032049 | 0.090803 | 坐标待核验，未下载 |
| 东洞庭湖湿地 | 2021 | 2021-09-24 | S2A_MSIL2A_20210924T030551_R075_T49RFN_20210927T055415 | 0.127787 | 坐标待核验，未下载 |
| 渔政巡护水域 | 2016 | 2016-12-09 | S2A_MSIL2A_20161209T031122_R075_T49RGN_20210213T191237 | 0.170976 | 坐标待核验，未下载 |
| 渔政巡护水域 | 2017 | 2017-10-30 | S2B_MSIL2A_20171030T030829_R075_T49RGN_20201015T031316 | 0.108910 | 坐标待核验，未下载 |
| 渔政巡护水域 | 2018 | 2018-10-05 | S2B_MSIL2A_20181005T030549_R075_T49RFN_20201009T082549 | 0.074791 | 坐标待核验，未下载 |
| 渔政巡护水域 | 2019 | 2019-09-30 | S2B_MSIL2A_20190930T030539_R075_T49RFN_20201004T185018 | 0.073022 | 坐标待核验，未下载 |
| 渔政巡护水域 | 2020 | 2020-11-08 | S2A_MSIL2A_20201108T030941_R075_T49RFN_20201110T032049 | 0.090803 | 坐标待核验，未下载 |
| 渔政巡护水域 | 2021 | 2021-09-24 | S2A_MSIL2A_20210924T030551_R075_T49RFN_20210927T055415 | 0.127787 | 坐标待核验，未下载 |

## Downloaded Imagery

None. The current public page correctly renders all 24 historical slots as `影像待补充` and all four 2026 field-flight slots as pending. This is intentional until coordinates are verified and the script successfully writes image files.

## Field Work Still Required

1. Verify the original CRS for the four map display coordinates and enter the corresponding WGS84 values.
2. Review the first downloaded crop for each point before downloading all years.
3. Add actual 2026 aerial images after field collection, including capture date, viewpoint/orthophoto status and consent/attribution information.
