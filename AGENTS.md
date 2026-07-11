# 智护碧水·数绘洞庭 — 项目文档

> 湖北大学计算机学院 2026 年暑期社会实践数据平台
>
> **受众**：后续接手开发的 Agent / 人类开发者
> **最后更新**：2026-06-09

---

## 一、项目概述

- **名称**：「智护碧水·数绘洞庭」
- **定位**：洞庭湖长江生态多源数据展示平台（SPA 单页应用）
- **部署**：GitHub Pages（纯静态，`https://<user>.github.io/dongtinghu/`）
- **数据来源**：卫星遥感（Sentinel-2 NDVI/水质反演）、无人机航拍、口述史采访、清滩统计、GPS 巡护轨迹

### 核心理念

**出发前搭框架 + 填已有数据 → 部署 → 回来后替换占位数据。**  
出发前网站已是活的、可扫码访问的。

---

## 二、技术栈

| 层 | 选型 | 版本 |
|----|------|------|
| 前端框架 | Vue 3 (Composition API + `<script setup>`) | 3.5 |
| 构建工具 | Vite | 6.2 |
| UI 组件库 | Element Plus | 2.14 |
| 图表 | ECharts (vue-echarts) | 6.1 |
| 地图 | Leaflet | 1.9 |
| 状态管理 | Pinia | 3.x |
| 路由 | Vue Router 4 (hash 模式) | 4.6 |
| 样式 | 自定义 CSS（主题色 `#2E86AB` 长江蓝） | — |
| 后端（可选） | Supabase（PostgreSQL + Auth + Storage） | — |
| 部署 | GitHub Pages | — |

---

## 三、文件结构

```
dongtinghu/
├── index.html                  # 入口 HTML
├── package.json                # 依赖声明
├── vite.config.js              # Vite 配置 (base: '/dongtinghu/')
├── .gitignore
├── supabase-schema.sql         # Supabase 建表 SQL（可选，未配时不用）
├── AGENTS.md                   # 本文档
│
├── public/
│   └── img/
│       └── placeholder-person.jpg  # 占位图片
│
├── src/
│   ├── main.js                 # 入口：挂载 Vue + Pinia + ElementPlus + Router
│   ├── App.vue                 # 根组件：NavBar + <router-view> + Footer
│   │
│   ├── router/
│   │   └── index.js            # 路由表 + 导航守卫（后台需登录）
│   │
│   ├── stores/
│   │   ├── auth.js             # 认证状态（Supabase 邮箱登录 / 本地密码 fallback）
│   │   └── data.js             # 数据层（Supabase 读写 / JSON fallback）
│   │
│   ├── lib/
│   │   └── supabase.js         # Supabase 客户端配置（填 URL + Key）
│   │
│   ├── data/                   # ★ 静态 JSON 数据（Supabase 未配置时的 fallback）
│   │   ├── interviews.json     #   口述史人物（5 条占位）
│   │   ├── geo.json            #   岸线点位（4 个）+ 巡护轨迹
│   │   ├── dashboard.json      #   水质/NDVI/植被/清滩/巡护数值
│   │   └── education.json      #   答题（10 题）+ 课堂反馈 + 作品墙
│   │
│   ├── views/
│   │   ├── Home.vue            #    首页：Hero + 4 模块卡片 + 实践路线
│   │   ├── OralHistory.vue     #    护江者说 — 人物列表
│   │   ├── OralHistoryDetail.vue#   人物详情（音频/转写/时间线/照片）
│   │   ├── Shoreline.vue       #    岸线寻访（Leaflet 地图 + 对比 + NDVI 图表）
│   │   ├── Dashboard.vue       #    数据看板（ECharts 图表仪表盘）
│   │   ├── Education.vue       #    童护长江（绘本翻页 + 答题闯关 + 作品墙）
│   │   ├── About.vue           #    关于（团队 + 日志 + 致谢）
│   │   └── admin/              # ★ 后台管理系统
│   │       ├── Login.vue       #      登录页（邮箱 / 本地密码双模式）
│   │       ├── AdminLayout.vue #      后台侧边栏布局
│   │       ├── Overview.vue    #      管理总览
│   │       ├── InterviewsManager.vue  # 人物 CRUD
│   │       ├── GeoManager.vue  #      地图点位 CRUD
│   │       ├── DashboardManager.vue   # 数据表格编辑
│   │       └── EducationManager.vue   # 答题/作品管理
│   │
│   ├── components/
│   │   ├── NavBar.vue          # 顶部导航栏（响应式）
│   │   └── PageFooter.vue      # 底部
│   │
│   └── assets/styles/
│       └── global.css          # 全局主题变量 + 通用样式
│
└── dist/                       # 构建产物（部署到 GitHub Pages）
```

---

## 四、页面路由表

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | Hero + 4 模块入口 + 实践路线 |
| `/oral-history` | 护江者说 | 人物卡片列表 |
| `/oral-history/:id` | 人物详情 | 音频播放、转写稿、时间线 |
| `/shoreline` | 岸线寻访 | 交互地图 + 对比 + NDVI ECharts |
| `/dashboard` | 数据看板 | 水质/植被/清滩/巡护图表 |
| `/education` | 童护长江 | 绘本翻页 + 答题 + 作品墙 |
| `/about` | 关于 | 团队 + 日志 + 致谢 |
| `/admin/login` | 后台登录 | 不公开，需直接输入地址 |
| `/admin` | 后台总览 | 需登录，侧边栏导航 |
| `/admin/interviews` | 人物管理 | CRUD 表单 |
| `/admin/geo` | 岸线管理 | 点位 CRUD + GPS 轨迹 |
| `/admin/dashboard` | 数据管理 | 表格编辑数值 |
| `/admin/education` | 教育管理 | 答题/反馈/作品 CRUD |

---

## 五、本地开发

```bash
# 1. 安装依赖（node_modules 缺失 vite 时需全局安装）
npm install
npm install -g vite@6.2.0 @vitejs/plugin-vue@5

# 2. 启动开发服务器
npx vite --host 0.0.0.0 --port 5173
# → http://localhost:5173/dongtinghu/

# 3. 构建生产版本
npx vite build
# 或: node node_modules/vite/bin/vite.js build
# → dist/ 文件夹
```

> **注意**：本项目 `vite.config.js` 设置了 `base: '/dongtinghu/'`，本地开发时所有资源均在 `/dongtinghu/` 路径下。

---

## 六、GitHub Pages 部署

```bash
# 1. 构建
npm run build

# 2. 推送到 gh-pages 分支
git checkout -b gh-pages
git add dist -f
git commit -m "deploy"
git subtree push --prefix dist origin gh-pages

# 3. GitHub → Settings → Pages → Source: gh-pages branch
# 访问: https://<用户名>.github.io/dongtinghu/
```

---

## 七、数据流架构

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  src/data/   │     │  Pinia Store │     │   Vue 组件      │
│  *.json      │────▶│  data.js     │────▶│   views/*.vue   │
│  (静态默认)  │     │  (内存缓存)  │     │   (模板渲染)    │
└─────────────┘     └──────┬───────┘     └─────────────────┘
                           │
                    ┌──────▼───────┐
                    │  Supabase    │  ← 可选：配置后读写云数据库
                    │  (PostgreSQL)│     未配置时静默跳过
                    └──────────────┘
```

### 数据优先级

1. **Supabase 已配置** → 启动时从云数据库拉取，覆盖默认 JSON
2. **Supabase 未配置** → 直接使用 `src/data/*.json` 静态文件
3. **Supabase 不可用（网络错误）** → 静默 fallback 到 JSON

> 管理员在后台填写的所有数据，通过 Supabase 实时写入数据库。普通用户扫码打开网站时，直接从 Supabase 读取最新数据。

### Supabase 配置方法

1. 注册 [supabase.com](https://supabase.com)，创建项目
2. SQL Editor 中执行 `supabase-schema.sql`（建表 + RLS + 种子数据）
3. 修改 `src/lib/supabase.js`：
   ```js
   const SUPABASE_URL = 'https://你的项目.supabase.co'
   const SUPABASE_ANON_KEY = 'eyJhbG...你的key...'
   ```
4. 重新 build + 部署

---

## 八、后台管理系统

### 访问方式

- **入口**：`/#/admin/login`（不公开，导航栏无入口，需手动输入地址）
- **默认本地密码**：`***`
- **Supabase 模式**：邮箱 + 密码登录（需先在 Supabase Auth 创建用户）

### 功能模块

| 模块 | 能力 |
|------|------|
| 护江者说 | 增删人物，填姓名/照片（支持上传）/录音/转写稿/时间线/关键词 |
| 岸线数据 | 增删地图点位（经纬度 + 对比图 URL），粘贴 GPS 巡护轨迹 |
| 数据看板 | 表格直改水质年份数据、植被覆盖、NDVI、清滩重量、巡护统计 |
| 童护长江 | 增删答题、添加课堂反馈、上传 AI 画作到作品墙 |

### 认证机制

```
登录 → 验证凭据 → 设置 Pinia auth.isLoggedIn = true
                → 导航守卫检查 meta.requiresAuth
                → 未登录自动跳转 /admin/login
```

路由守卫在 `router/index.js` 的 `beforeEach` 中实现。

---

## 九、实践后数据填充流程

回来后，只需修改 `src/data/` 下的 4 个 JSON 文件：

| 文件 | 填什么 |
|------|--------|
| `interviews.json` | 真实姓名/照片URL/采访录音URL/AI转写全文/时间线事件/关键词 |
| `geo.json` | 真实 GPS 巡护轨迹数组 `[[lat,lng],...]`、渔民标注点 |
| `dashboard.json` | 清滩实际重量 `plastic/net/foam/other`、巡护里程/时长 |
| `education.json` | 课堂答题正确率、AI画作图片URL、孩子们的话 |

填完后重新 `npm run build` → 部署到 GitHub Pages 即可。

> 如果配了 Supabase，直接在后台管理页面上传即可，不需要手动改 JSON。

---

## 十、关键设计决策

1. **Hash 路由** — GitHub Pages 不支持 History 模式，使用 `createWebHashHistory()`
2. **base: '/dongtinghu/'** — Vite 配置，确保 GitHub Pages 路径正确
3. **Leaflet 高德瓦片** — 国内加载快，中文标注；scoped CSS 需要 `:deep()` 穿透
4. **ECharts 按需引入** — 减小打包体积（`use([LineChart, BarChart, ...])`）
5. **Pinia setup stores** — 使用 Composition API 风格，`ref` 自动在模板中 unwrap
6. **Supabase 静默降级** — 未配置时创建 mock 客户端，不发网络请求，不报错
7. **后台隐藏** — 导航栏无后台入口，必须手动输入 `/#/admin/login`

---

## 十一、给后续 Agent 的开发提示

1. **修改页面数据** → 只改 `src/data/*.json`，不动 Vue 组件
2. **添加新页面** → 在 `views/` 新建 `.vue` → `router/index.js` 加路由 → `NavBar.vue` 加导航链接
3. **修改图表** → 在对应 view 的 `computed` 选项中修改 ECharts option
4. **地图相关** → Leaflet 初始化在 `Shoreline.vue` 的 `initMap()` 中，瓦片源在 `tileUrl` 变量
5. **构建命令**：`node node_modules/vite/bin/vite.js build`
6. **构建后**：`dist/` 目录即是 GitHub Pages 的发布目录
7. **图片引用**：放在 `public/` 的文件通过 `/dongtinghu/文件名` 访问；Vue 模板中用 `:src="变量"` 绑定字符串路径避免 Vite 解析错误
