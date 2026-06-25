# Blueprint: Emoji-Hub (Global Emoji SSOT & Interactive Playground)

## 🎯 项目定位与当前状态
- **项目名称**: Emoji-Hub
- **核心目标**: 建立全宇宙通用的中心化表情资产库 (Single Source of Truth)，并基于此打造高互动性的 Emoji 创意应用生态。
- **差异化竞争**: 不同于 Emojipedia (严肃查阅的百科)，Emoji-Hub 定位为 **Playground (游乐场)**，主打二次创作与社交裂变玩法。
- **当前进度**: **V1.5 平台化架构完成**。实现了完美对齐的响应式网格、SPA (单页应用) 模式切换架构、沉浸式盲打输入机制，以及带口令锁的密码机与社交裂变模块。

## 📁 目录结构 (Modular & App-based Architecture)
`emoji-hub/`
- `data/`
  └─ `emoji-map.json`     : 核心数据库 (约 3958 个资产)，由 Node.js 脚本一键抓取生成。
- `assets/`
  ├─ `svg/`               : 高清无损矢量库（供游戏引擎与 UI 无极缩放）。
  └─ `png_64x64/`         : 轻量级栅格图（供 Web 端快速渲染）。
- `doc/`
  └─ `blue-print.md`      : 项目架构蓝图（系统演进的单点事实库）。
- `index.html`            : 核心 UI 骨架，包含顶层导航、App 生态区、纵向密文创作台及底层完美网格 (CSS Grid)。
- `style.css`             : 定制化极客样式，包含强迫症级对齐网格 `.perfect-grid` 与错误反馈震动动画。
- `app.js`                : **基座系统 (Base OS)**。负责状态机 (Mode Switch)、数据加载、防抖搜索、触底渲染。
- `cipher.js`             : **扩展应用 (App Module)**。负责密文生成、口令加密 (Password Lock)、社交平台快捷分享与解密拦截。
- `build.js`              : 自动化数据清洗脚本。

## 🔮 核心业务机制：无状态密码机 & 社交裂变 (Viral Engine)
系统采用纯前端状态管理与 URL 路由传递，实现 0 服务器成本的商业闭环：
1. **沉浸式创作 (Studio)**：用户进入 App 模式后，直接在瀑布流中盲打点击，零弹窗组装 `[💴💴💴]`。
2. **多维加密 (Encode)**：将表情组合、文字含义以及 **[可选解锁口令]** 打包为 JSON，进行安全的 Base64(URI) 编码。
3. **社交裂变 (Share)**：一键生成分发链接，并集成 𝕏(Twitter)、Facebook、Reddit、WhatsApp 等快捷分享入口。
4. **互动解密 (Decode & Reveal)**：接收者点击链接触发全屏黑客网拦截。若含口令，则展示验证 UI（错误带物理震动反馈），成功后揭示含义并引导用户回流成为创造者。

## 🌐 分发与调用架构 (CDN Strategy)
- 零后端动态服务器，纯静态托管架构 (GitHub Pages)。
- 全球资产分发依赖开源免费 CDN (如 jsDelivr)。

## 🚀 阶段开发与演进路径 (Roadmap)
- [x] **Phase 1: 数据层初始化** (完成本地资产掠夺，生成 JSON 大脑)。
- [x] **Phase 2: 表现层与性能优化** (IntersectionObserver 触底加载与毫秒级防抖搜索)。
- [x] **Phase 3: 平台化与互动升级** (剥离 App Zone，引入完美网格 CSS Grid，完成带口令验证的密文机与裂变 UI)。
- [ ] **Phase 4: 云端部署与 CDN 激活** (推送到 GitHub 主分支，开启 Pages，测试外链连通性)。
- [ ] **Phase 5: 生态扩展探讨** (未来基于 App Zone 增加 Emoji Canvas 画板、Emoji 密码生成器等新玩法)。