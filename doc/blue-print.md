# Blueprint: Emoji-Hub (Global Emoji SSOT & Asset Provider)

## 🎯 项目定位与当前状态
- **项目名称**: Emoji-Hub
- **核心目标**: 建立全宇宙通用的中心化表情资产库 (Single Source of Truth)，作为外部应用和游戏引擎的云端素材基座。
- **当前进度**: **V2.0 云端部署与多端分发期**。本地构建与高并发表现层已完成，代码已全量 Push 至 GitHub。目前主线任务为外部游戏项目（原生 JS 割草游戏）的 CDN 接入服务。

## 📁 目录结构 (Modular & App-based Architecture)
`emoji-hub/`
- `data/`
  └─ `emoji-map.json`     : 核心数据大脑 (3958 个资产)，外部游戏预加载与检索的检索字典。
- `assets/`
  ├─ `svg/`               : 高清无损矢量库（供 UI 无极缩放）。
  └─ `png_64x64/`         : 轻量级栅格图（供 Canvas 游戏引擎极速绘制）。
- `doc/`
  └─ `blue-print.md`      : 项目架构蓝图。
- `index.html` & `style.css`: 核心可视化控制台，基于 CSS Grid 的完美对齐瀑布流。
- `app.js`                : 控制台基座系统。负责防抖搜索、触底渲染。
- `cipher.js`             : **[已冻结/备用]** 密文机与社交裂变应用。
- `build.js`              : 自动化数据清洗与映射脚本。

## 🌐 分发与游戏调用架构 (Game Engine Integration)
系统已完全剥离动态后端，纯静态托管于 GitHub，全球资产分发依赖 `jsDelivr` CDN。

**🟢 外部游戏引擎接入标准 (以原生 JS 为例):**
- 专门封装了轻量级的 `EmojiAssetManager` 类。
- **按需加载 (Lazy Load)**：通过读取 `emoji-map.json` 匹配对应素材。
- **内存优化 (Cache Pool)**：利用 `Map` 建立本地 Image 对象缓存池，避免重复请求网络。
- **跨域绘制 (CORS)**：图片请求开启 `crossOrigin = "Anonymous"`，完美支持 HTML5 Canvas 渲染。

## 🚀 阶段开发与演进路径 (Roadmap)
- [x] **Phase 1: 数据层初始化** (完成本地资产掠夺，生成 JSON 大脑)。
- [x] **Phase 2: 表现层与性能优化** (IntersectionObserver 触底加载与毫秒级防抖搜索)。
- [x] **Phase 3: 平台化与互动升级** (引入完美网格 CSS Grid，完成带口令验证的密文机业务闭环)。
- [x] **Phase 4: 云端部署与 CDN 激活** (成功推送 GitHub，强覆盖更新，建立全局外部调用规则)。
- [x] **Phase 5: 游戏业务集成** (暂停密文机支线，为主线游戏项目输出 CDN 加载器类模块)。
- [ ] **Phase 6: 开源门面建设** (待定：未来为该项目编写符合国际规范的开源 `README.md`，添加项目徽章与开发者调用文档)。