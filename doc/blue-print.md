# Blueprint: Emoji-Hub (Global Emoji SSOT & Multiverse Playground)

## 🎯 项目定位与当前状态
- **项目名称**: Emoji-Hub
- **核心目标**: 建立全宇宙通用的中心化表情资产库，并打造跨厂牌、高互动的 Emoji 创意应用生态。
- **当前进度**: **V2.1 CDN稳定期 & V3.0 多重宇宙规划期**。CDN 基座已完美服务于外部割草游戏。目前正在进行 V3.0 架构沙盘推演，计划引入四大开源巨头（Twitter, Microsoft, Google, OpenMoji）的素材体系。

## 📁 [演进中] 目录结构 (Multiverse Architecture)
`emoji-hub/`
- `data/`
  ├─ `twemoji-map.json`   : [已完成] Twitter 开源数据大脑。
  └─ `...`                : [规划中] Fluent, Noto, OpenMoji 等独立数据大脑。
- `assets/`
  ├─ `twemoji/`           : [已完成] 现有的 3958 个基础资产。
  └─ `.../`               : [规划中] 其他厂牌的独立资产目录（物理硬隔离）。
- `doc/`
  └─ `blue-print.md`      : 项目架构蓝图。
- `index.html` & `style.css`: 核心视图。计划在顶层引入“厂牌 Tag 切换器”与动态版权徽章。
- `app.js`                : 系统基座。计划重构数据流，支持多字典动态无缝切换。
- `cipher.js`             : **[已冻结待升级]** 计划支持“跨宇宙勒索信风格”的混合密文打包。
- `build.js`              : 数据清洗脚本，计划升级为多目标源爬虫矩阵。

## 🌐 分发与游戏调用架构 (Game Engine Integration)
- **全局根地址 (Base URL)**: `https://cdn.jsdelivr.net/gh/sangohai/emoji-hub@main/`
- **游戏端规范**: 严格执行 `Base URL + 相对路径` 的跨域 (CORS) 动态加载，确保与未来多厂牌路径完美兼容。

## 🚀 阶段开发与演进路径 (Roadmap)
**【已完成：V1.0 - V2.0 基础设施】**
- [x] 完成 Twemoji 数据抓取与 `emoji-map.json` 生成。
- [x] 完成 CSS Grid 完美对齐与防抖、触底加载等极速前端表现。
- [x] 完成 GitHub Pages 部署，修复 404 路径截断，输出绝对路径 CDN 标准。

**【规划中：V3.0 多重宇宙拓展】**
- [ ] **Phase 1: 基础设施扩容** (抓取 Microsoft, Google, OpenMoji 的资产，生成独立 JSON)。
- [ ] **Phase 2: 厂牌层级重构** (实现搜索栏上方的厂牌 Tag 切换、动态版权声明板)。
- [ ] **Phase 3: 混合密文升级** (解冻密码机，支持跨厂牌 Emoji 混拼的“勒索信”视觉解密体验)。