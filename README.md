# zjcvibe-site

"智护碧水·数绘洞庭"洞庭湖长江生态多源数据展示平台。

技术栈：Vue 3、Vite、Element Plus、ECharts、Leaflet、Pinia 和 Vue Router。

本地启动：

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

## 历史卫星影像

“岸线寻访”页面为四个调查点位预留了 2016-2021 年的卫星影像时间轴与 2026 年实地航拍位。当前没有任何历史影像被伪装为已下载：在地图显示坐标完成 WGS84 核验前，页面会清楚显示“影像待补充”。

卫星影像下载流程和依赖位于 `scripts/satellite/`，完整的数据约束、点位清单和下载状态见 `docs/satellite-imagery-report.md`。下载脚本优先检索 Microsoft Planetary Computer 提供的 Sentinel-2 L2A 公开 STAC 数据，固定使用秋季窗口和统一 bbox，输出 WebP 文件至 `public/img/satellite/<point-id>/`，同时把实际日期、产品编号、云量、归属信息写回 `src/data/geo.json`。
