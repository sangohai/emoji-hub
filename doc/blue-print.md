# Blueprint: Emoji-Hub (Global Emoji SSOT & Multiverse Playground)

## 🎯 项目定位与当前状态
- **项目名称**: Emoji-Hub
- **核心目标**: 建立全宇宙通用的中心化表情资产库，打造跨厂牌、高互动的 Emoji 创意应用生态与游戏资源基座。
- **当前进度**: **V3.0 多重宇宙基座 100% 竣工**。已完美集齐 Twemoji, Microsoft Fluent, Google Noto, OpenMoji 四大巨头资产。完成了资产的提纯与降噪（如修复 Fluent 默认黄豆肤色排序 Bug）。目前资产已全量推至 GitHub，通过 jsDelivr 驱动外部游戏。

## 📁 目录结构 (Multiverse Architecture)
`emoji-hub/`
- `data/`
  ├─ `twemoji.json`       : Twitter 扁平风 (标准基座)。
  ├─ `fluent.json`        : Microsoft 3D 风 (智能过滤肤色变体)。
  ├─ `noto.json`          : Google 安卓果冻风。
  └─ `openmoji.json`      : 德国 OpenMoji 手绘风。
- `assets/`
  ├─ `twemoji/`, `fluent/`, `noto/`, `openmoji/` : 物理硬隔离的资产黑盒。
  └─ `original/`          : **[预留]** UGC 社区原创或专属游戏皮肤。
- `doc/`
  └─ `blue-print.md`      : 核心系统蓝图。
- `index.html` & `style.css`: 多宇宙切换控制台 (引入 CSS Grid, 8px 识别色条, HEX 编码可视化)。
- `app.js`                : 系统基座引擎。实装跨宇宙路由、字典热切换与智能路径补全。
- `cipher.js`             : **[待解冻]** 跨宇宙混合密文机小工具。
- `build-*.js`            : **[IaC 资产图纸]** 自动化提纯脚本集，保障未来上游库更新时可一键无缝迭代。

## 🌐 游戏分发与调用架构 (Game Engine Integration)
- **全局根地址 (Base URL)**: `https://cdn.jsdelivr.net/gh/sangohai/emoji-hub@main/`
- **动态寻址**: 游戏引擎加载素材时只需切换路径前缀 (如 `/assets/fluent/...`) 即可实现一键 3D 画风换皮。

## 🚀 阶段开发与演进路径 (Roadmap)
**【已完成：V1.0 - V2.0 基础图床与 CDN 部署】**
- [x] 完成基础数据抓取、瀑布流展示、防抖搜索与跨域 CDN 全局调用规范。

**【已完成：V3.0 多重宇宙拓展】**
- [x] **Phase 1: 基础设施扩容** (全量提取四大厂牌资产，完成智能降噪过滤，物理毁灭临时母库以保证轻量化)。
- [x] **Phase 2: 厂牌层级重构** (实装厂牌 Tag 切换、动态加载、HEX 编码快速提取视图)。

**【即将开启：V3.5 跨宇宙应用生态】**
- [ ] **Phase 3: 混合密文机 (Cipher App) 升级** 
  - 解冻 `cipher.js`。
  - 支持记录每个表情的“厂牌来源 (Brand Origin)”。
  - 研发“勒索信风格”的跨宇宙密文混合解密算法与视觉呈现。