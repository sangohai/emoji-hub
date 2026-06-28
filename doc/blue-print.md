# Blueprint: Emoji-Hub (Global Emoji SSOT & Multiverse Playground)

## 🎯 项目定位与当前状态
- **项目名称**: Emoji-Hub
- **核心目标**: 建立全宇宙通用的中心化表情资产库，打造跨厂牌、高互动的 Emoji 创意应用生态与游戏资源基座。
- **当前进度**: **V3.0 多重宇宙基座完工，进行多端测试中**。已集齐全球四大开源巨头资产并实现物理隔离。前端已实装带有专属 8px 颜色识别线的厂牌 Tag 切换器，支持动态无缝加载不同厂牌的 JSON 字典。

## 📁 目录结构 (Multiverse Architecture)
`emoji-hub/`
- `data/`
  ├─ `twemoji.json`       : Twitter 扁平风数据大脑。
  ├─ `fluent.json`        : Microsoft 3D 风数据大脑。
  ├─ `noto.json`          : Google 果冻风数据大脑。
  └─ `openmoji.json`      : OpenMoji 手绘风数据大脑。
- `assets/`
  ├─ `twemoji/`, `fluent/`, `noto/`, `openmoji/` : 四大厂牌资产硬隔离（均含 svg 与 png_64x64）。
  └─ `original/`          : **[预留]** 社区或游戏专属原创生态位。
- `doc/`
  └─ `blue-print.md`      : 项目架构蓝图。
- `index.html` & `style.css`: 引入厂牌 Tag (Brand Tabs) 与版权标识，保持 CSS Grid 完美对齐。
- `app.js`                : 系统基座 (V3.0)。实装单例事件管理、智能路径补全与字典热切换。
- `cipher.js`             : **[已冻结待升级]** 跨宇宙混合密文机小工具。
- `build-*.js`            : **[核心基建资产]** 保留所有自动化 Node.js 清洗脚本，作为未来一键升级官方库的基础设施即代码 (IaC)。

## 🌐 游戏分发与调用架构 (Game Engine Integration)
- **全局根地址 (Base URL)**: `https://cdn.jsdelivr.net/gh/sangohai/emoji-hub@main/`
- **一键换皮 (Style Switching) 路径规范**: 
  - 🐦 扁平风: `Base URL + assets/twemoji/png_64x64/[hex].png`
  - 🪟 立体风: `Base URL + assets/fluent/png_64x64/[hex].png`
  - 🇬 安卓风: `Base URL + assets/noto/png_64x64/[hex].png`
  - 🎨 手绘风: `Base URL + assets/openmoji/png_64x64/[hex].png`

## 🚀 阶段开发与演进路径 (Roadmap)
**【已完成：V1.0 - V2.0 基础图床与 CDN 部署】**
- [x] 完成基础数据抓取、瀑布流展示、防抖搜索与跨域 CDN 全局调用规范。

**【已完成：V3.0 多重宇宙拓展】**
- [x] **Phase 1: 基础设施扩容** (完成 Microsoft, Google, OpenMoji 的资产洗劫与 JSON 生成，并彻底清理本地母库)。
- [x] **Phase 2: 厂牌层级重构** (实现搜索栏上方的厂牌 Tag 切换、8px 品牌识别色实装)。

**【待唤醒：V3.5 跨宇宙应用生态】**
- [ ] **Phase 3: 混合密文升级** (解冻密码机，支持跨厂牌 Emoji 混拼的“勒索信”视觉解密体验)。