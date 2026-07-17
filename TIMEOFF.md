# 项目交接：智护碧水·数绘洞庭

> 本文写给没有任何上下文的新会话。最后核对：2026-07-18。
> 工作目录：`D:\PyCharm\Python_workspace\dongtinghu`

## 1. 当前任务与目标

这是湖北大学暑期“三下乡”洞庭湖社会实践网站，项目名为“智护碧水·数绘洞庭”。它是面向公众展示的静态 SPA，包含：

- 首页与五日实践行程；
- “护江者说”人物故事；
- “岸线寻访”互动地图、四个调查点和 2016--2021 年 Sentinel-2 历史影像；
- “数据看板”中的现场水样、江豚与遥感数据；
- “童护长江”课堂内容、问答与学生作品墙；
- “关于”页面及团队实践信息。

用户期望：页面内容随实践材料持续补充；每次完成并确认后提交、推送 GitHub，Cloudflare Pages 会由 GitHub `main` 自动重新部署。

## 2. 仓库、分支与部署

- GitHub 远程仓库：`https://github.com/Ohh-zjc/zjcvibe-site.git`
- 当前分支：`main`
- Cloudflare Pages：已配置为从 GitHub 仓库自动部署；静态站点已经可以正常访问，不再是空白页。
- Vite 配置：`vite.config.js` 根据 `CF_PAGES` 切换路径：Cloudflare 为 `/`，GitHub Pages 为 `/dongtinghu/`。**不要改回固定路径**，否则 Cloudflare 可能再次出现资源 404 和空白页。

常用命令（在项目根目录执行）：

```powershell
npm run dev -- --host 0.0.0.0 --port 5173
npm run build
git status
git add <files>
git commit -m "feat: ..."
git push origin main
```

若 Codex/沙箱身份提示 `dubious ownership`，Git 命令使用：

```powershell
git -c safe.directory=D:/PyCharm/Python_workspace/dongtinghu status
```

不要强行 `reset --hard`、`checkout --` 或覆盖用户已有的未提交改动。

## 3. 技术架构

- Vue 3 + Vite 6，Vue Router（hash 模式）、Pinia、Element Plus；
- Leaflet + 高德瓦片用于地图；
- ECharts / vue-echarts 用于数据图；
- 项目本身没有 Spring Boot 后端；Supabase 是可选的数据库/认证/存储后端。目前主要使用 `src/data/*.json` 静态数据兜底；
- `dist/` 是构建产物，但 Cloudflare Pages 应当执行 `npm run build` 并发布 `dist`，不建议手工提交 `dist` 来代替构建。

关键入口：

- `src/views/Home.vue`：首页与五日行程；
- `src/views/Shoreline.vue`：地图、点位、影像时间轴与对比；
- `src/views/Dashboard.vue`：数据看板；
- `src/views/Education.vue`：童护长江、课堂与作品墙；
- `src/views/OralHistory.vue`、`OralHistoryDetail.vue`：护江者说；
- `src/views/About.vue`：关于页；
- `src/data/*.json`：静态内容主数据；
- `src/stores/data.js`：Supabase 读取失败时使用 JSON，新增数据字段时要同步这里的 fallback 合并逻辑。

## 4. 已完成的主要工作

### 部署与基础

- 修复依赖并可本地启动、生产构建。
- 修复 Cloudflare Pages 根路径资源问题：`CF_PAGES` 环境下使用 `/` base。
- GitHub 仓库已关联并持续推送；最新已提交 commit 为 `bfe134b feat: add field water and porpoise dashboard data`（2026-07-17）。
- 页脚和相关页面已增加可扫码访问网站的二维码，移除了突兀的“扫码访问”和裸网址文字。
- 首页“向下探索”滚动操作已修复。

### 岸线寻访与卫星图

- Leaflet 地图使用真实的高德 POI 点位，当前保留四点：
  1. 华龙码头（江豚湾）：岳阳市君山区芦苇总场七弓岭河段；
  2. 东洞庭湖湿地：湖南东洞庭湖国家级自然保护区；
  3. 渔政监督管理局：岳阳市岳阳楼区磨子山 64 号；
  4. 南湖广场公园：岳阳市岳阳楼区南湖广场。
- 原“洞庭湖景区”点已删除并替换为“南湖广场公园”。
- 为以上四点下载并接入真实 Sentinel-2 L2A 2016--2021 年影像，共 24 张，路径为 `public/img/satellite/<point-id>/<year>.webp`。
- 卫星检索、坐标转换、产品编号、日期、云量和限制说明保存在 `src/data/geo.json`、`docs/satellite-imagery-report.md` 与 `docs/satellite-imagery-manifest.generated.json`。
- 华龙码头 2021 图已经替换为 2021-09-09 的 9 月影像，避免先前过曝/12 月影像问题。
- 南湖广场 2016 影像已补齐；该年没有合适的 9 月场景，因此该点 2016 的特例允许检索至 12 月 15 日，实际日期为 2016-12-09，必须诚实保留这个元数据，不要标成 9 月。
- 渔政监督管理局的 2026 对比图已从用户无人机视频提取连续帧并拼成湖岸/居民区对照图：`public/img/field/fishery/2026-shoreline-residents.webp`，已在 `geo.json` 的 `fishery.current` 中使用。
- 其他三个点的 2026 实拍图尚待用户现场提供；当前刻意留空，不应伪造“当前影像”。

### 童护长江与课堂素材

- 页面已经按“江豚宣教”PPT的方向改写，补充江豚特征、家族、威胁、保护等课堂内容。
- 补充多张课堂/江豚图片至 `public/img/education/`。
- 作品墙已接入多张用户提供的活动照片，图片以 WebP 放在 `public/img/education/artworks/`；布局已处理为不在照片下方留下多余空白。

### 实践行程、人物与页面文案

- 首页与关于页的 Day 1--Day 5 已对应周二至周六：
  - 周二：展陈馆学习、幼儿园江豚宣教；
  - 周三：渔政执法局、数据中心与巡护；
  - 周四：问卷调研与无人机航拍；
  - 周五：渔民访谈与社区谈话；
  - 周六：江豚保护协会交流与清滩行动。
- “护江者说”已删除城陵矶水文站人物、采访录音、关键年份、声纹可视化和 NLP 语义分析，保留并改写不同角色的文字人物稿。

### 数据看板

- 已展示用户现场水样快检：TDS 156 mg/L、pH 弱碱性、余氯低检出、检出钙/镁/锌；这些是实践快检，非资质实验室水质报告。
- 已展示洞庭湖江豚当前记录 194 头（由实践团队提供，须明确为团队记录口径）和 2022 年长江江豚科学考察 1,249 头（2023 年联合发布的公开口径）。

## 5. 当前进行到哪一步（重要）

用户最新的功能要求是：在数据看板中再补充可视化数据，使页面更平衡、美观，例如泥沙含量、浑浊度折线图；先给用户看效果，再由用户决定提交。

这项工作已经**写入、已于 2026-07-18 通过 `npm run build`，但尚未做浏览器视觉检查、未提交、未推送**。当前工作区有以下未提交修改：

- `src/data/dashboard.json`：新增 `remote_sensing`，含华龙码头固定江面窗口 2016--2021 的 NDTI（悬浮泥沙相对指数）与红光波段浑浊度代理值；来源注明为 Microsoft Planetary Computer Sentinel-2 L2A。
- `src/stores/data.js`：Supabase 返回数据时增加 `remote_sensing` 的 JSON fallback。
- `src/views/Dashboard.vue`：新增“江面悬浮物与浑浊度相对变化”区块，使用两个 ECharts 折线图；窄屏时变成单列。
- `TIMEOFF.md`：本交接文档；通常应随下一次经用户确认的功能提交一并纳入版本控制。

下一位接手者应按以下顺序继续：

1. 已通过 `npm run build`；后续改动后请再次构建。当前仅有 Vite 的既有 chunk 体积和依赖注释警告，无构建错误；
2. 启动本地站点，重点检查 `/#/dashboard` 的桌面和手机宽度，确认两张图、标题、说明和响应式没有溢出；
3. 让用户看效果，必要时再调整图表数量、顺序、颜色或文字；
4. 经用户确认后，才提交这三个文件并 `git push origin main`；Cloudflare 会自动同步。

## 6. 数据严谨性与常见坑

1. **不要把遥感代理值说成实测浓度。** 当前 NDTI/红光数值只能称为“相对指数/代理值”，不能标成泥沙浓度 mg/L 或浊度 NTU，也不能据此单独宣称治理成效。
2. **不要捏造 2026 当前图、采访录音、精确坐标或现场检测。** 没有用户提供材料时，应留占位和说明。
3. 地图呈现坐标是高德 POI 的 **GCJ-02**；卫星下载用的是反算的 **WGS84** 坐标，均待现场复核。不要混用 CRS，也不要宣称其为测绘级坐标。
4. 时间要求优先使用 9 月 Sentinel-2 影像；若某年没有可用图，应保留实际日期/例外理由，不能把 12 月图改标为 9 月。
5. 新增 `dashboard.json` 字段时，必须同时检查 `src/stores/data.js`：如果 Supabase 配置后返回一份旧数据，新增字段会丢失；要给新字段提供 `dashboardJson` fallback。后台 `saveDashboard()` 目前也没有写入 `remote_sensing`，若日后启用 Supabase 编辑功能，要同步改数据库 schema、保存方法和后台表单。
6. 当前用户实际使用 Cloudflare Pages，非旧文档中仅写的 GitHub Pages；`CF_PAGES` base 配置不能删除。Hash 路由仍必须保留。
7. 所有放在 `public/` 的图片在代码里用根路径 `/img/...`；Vite 会按 base 自动处理。不要随意改为相对路径。
8. 新会话不要自动推送。先检查 `git status`，尊重这三处数据看板修改和本交接文档；只有用户明确确认后才提交推送。
9. 控制台/PowerShell 若中文乱码，多半是终端编码显示问题，源文件本身按 UTF-8 保存。编辑时避免把中文误转码；使用 `Get-Content -Encoding UTF8` 可核对。

## 7. 近期提交索引

- `bfe134b`：现场水样与江豚数据看板；
- `c52373a`：简化护江者说；
- `d486045`：五日实践行程；
- `8bf0fb8`、`52e4a55`：课堂作品墙；
- `74aa5a8`：童护长江按江豚宣教内容调整；
- `0d8eaa9`、`d79dfca`：南湖广场替换洞庭湖景区并补齐 2016 卫星图；
- `8eb0e6b`：华龙码头 2021 年 9 月影像；
- `50494d0`：渔政监督管理局 2026 无人机拼图；
- `a54b8d4`：纠正地图点位并刷新 Sentinel 影像；
- `414cd74`、`c74cd1a`：二维码；
- `f6dbab6`：首页向下探索；
- `d5e680d`：Cloudflare Pages 路径修复。

## 8. 相关资料位置

- 项目规则与初始架构：`AGENTS.md`；
- 卫星影像说明：`docs/satellite-imagery-report.md`；
- 卫星下载脚本：`scripts/satellite/fetch_satellite_images.py`；
- 地图与影像元数据：`src/data/geo.json`；
- 数据看板数据：`src/data/dashboard.json`；
- 三下乡申报表和原始 PPT/照片位于用户个人磁盘，未全部纳入仓库；需要新素材时向用户索取原文件路径并确认用途。
