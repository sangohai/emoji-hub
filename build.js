// build.js
const fs = require('fs');
const path = require('path');

// 配置路径
const ASSETS_SVG_DIR = path.join(__dirname, 'assets', 'svg');
const OUTPUT_JSON = path.join(__dirname, 'data', 'emoji-map.json');

// GitHub Gemoji 提供的高质量元数据库（包含标签、分类和字符）
const GEMOJI_URL = 'https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json';

async function buildEmojiMap() {
  console.log('🚀 [1/4] 正在从云端抓取 Emoji 语义元数据...');
  const response = await fetch(GEMOJI_URL);
  const gemojiData = await response.json();

  // 建立 Unicode 到元数据的映射字典
  const metaDict = {};
  for (const item of gemojiData) {
    if (!item.emoji) continue;
    // 将表情字符转换为 Twemoji 风格的 hex 文件名 (例如 😀 -> 1f600)
    const hexPoints = Array.from(item.emoji)
      .map(c => c.codePointAt(0).toString(16))
      .filter(h => h !== 'fe0f')
      .join('-');
      
    metaDict[hexPoints] = {
      id: item.aliases[0] || 'unknown',
      char: item.emoji,
      category: item.category || 'Symbols',
      keywords: item.tags || []
    };
  }

  console.log('📂 [2/4] 正在遍历本地资产目录...');
  const files = fs.readdirSync(ASSETS_SVG_DIR);
  const svgFiles = files.filter(f => f.endsWith('.svg'));
  const emojiMap = [];

  console.log(`🧠 [3/4] 开始匹配 ${svgFiles.length} 个本地图标并构建数据大脑...`);
  
  for (const file of svgFiles) {
    const hex = file.replace('.svg', '');
    const meta = metaDict[hex] || metaDict[hex.split('-')[0]];

    if (meta) {
      emojiMap.push({
        id: meta.id,
        char: meta.char,
        category: meta.category,
        keywords: [...new Set([...meta.keywords, meta.id])],
        svg_url: `assets/svg/${file}`,
        png_url: `assets/png_64x64/${hex}.png`
      });
    }
  }

  console.log('💾 [4/4] 正在写入核心大脑...');
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(emojiMap, null, 2), 'utf-8');
  
  console.log(`🎉 任务完成！共生成了 ${emojiMap.length} 个 Emoji 的完美映射表！`);
}

buildEmojiMap().catch(err => console.error('❌ 发生错误:', err));