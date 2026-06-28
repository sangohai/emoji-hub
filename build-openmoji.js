// build-openmoji.js - OpenMoji 手绘风资产洗劫与构建脚本
const fs = require('fs');
const path = require('path');

// 路径配置
const OPENMOJI_REPO = path.join(__dirname, 'temp_openmoji');
const OUT_SVG = path.join(__dirname, 'assets', 'openmoji', 'svg');
const OUT_PNG = path.join(__dirname, 'assets', 'openmoji', 'png_64x64');
const OUTPUT_JSON = path.join(__dirname, 'data', 'openmoji.json');

// Gemoji 字典 API
const GEMOJI_URL = 'https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json';

// 创建专属文件夹
fs.mkdirSync(OUT_SVG, { recursive: true });
fs.mkdirSync(OUT_PNG, { recursive: true });

async function buildOpenMojiMap() {
    console.log('🚀 [1/4] 正在从云端抓取 Emoji 语义元数据...');
    const response = await fetch(GEMOJI_URL);
    const gemojiData = await response.json();

    // 建立标准 Unicode 字典 (强行剥离所有 fe0f 变体符，确保全宇宙统一匹配)
    const metaDict = {};
    for (const item of gemojiData) {
        if (!item.emoji) continue;
        const strippedHex = Array.from(item.emoji)
            .map(c => c.codePointAt(0).toString(16))
            .filter(h => h !== 'fe0f') 
            .join('-');
        metaDict[strippedHex] = item;
    }

    console.log('📂 [2/4] 开始扫描 OpenMoji 资源库...');
    if (!fs.existsSync(OPENMOJI_REPO)) {
        console.error('❌ 找不到 temp_openmoji 文件夹，请先执行 git clone!');
        return;
    }

    // OpenMoji 把彩色版放在 color 目录下，我们优选 72x72 的 PNG（如果没有则拿 618 大图）
    const svgDir = path.join(OPENMOJI_REPO, 'color', 'svg');
    const pngDir72 = path.join(OPENMOJI_REPO, 'color', '72x72');
    const pngDir618 = path.join(OPENMOJI_REPO, 'color', '618x618');
    const pngDir = fs.existsSync(pngDir72) ? pngDir72 : pngDir618;

    if (!fs.existsSync(svgDir)) {
        console.error('❌ 无法在 OpenMoji 中找到 color/svg 目录！');
        return;
    }

    const svgFiles = fs.readdirSync(svgDir).filter(f => f.endsWith('.svg'));
    const openmojiMap = [];

    console.log(`🧠 [3/4] 开始智能匹配并提取手绘资产...`);

    for (const file of svgFiles) {
        // OpenMoji 原始命名格式: 1F468-200D-1F4BB.svg
        const rawHex = file.replace('.svg', '').toLowerCase();
        
        // 剥离 OpenMoji 命名中可能带有的 fe0f，以对齐我们的基础字典
        const standardHex = rawHex.split('-').filter(h => h !== 'fe0f').join('-');
        const meta = metaDict[standardHex];

        if (meta) {
            const sourceSvg = path.join(svgDir, file);
            // PNG 文件名与 SVG 保持一致
            const sourcePng = path.join(pngDir, file.replace('.svg', '.png'));

            if (fs.existsSync(sourcePng)) {
                // 拷贝并统一重命名为我们系统标准的 standardHex
                fs.copyFileSync(sourceSvg, path.join(OUT_SVG, `${standardHex}.svg`));
                fs.copyFileSync(sourcePng, path.join(OUT_PNG, `${standardHex}.png`));

                openmojiMap.push({
                    id: meta.aliases[0] || 'unknown',
                    char: meta.emoji,
                    category: meta.category || 'Symbols',
                    keywords: [...new Set([...(meta.tags || []), meta.aliases[0]])],
                    svg_url: `assets/openmoji/svg/${standardHex}.svg`,
                    png_url: `assets/openmoji/png_64x64/${standardHex}.png`
                });
            }
        }
    }

    console.log('💾 [4/4] 正在生成 openmoji.json 数据大脑...');
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(openmojiMap, null, 2), 'utf-8');
    
    console.log(`🎉 任务完成！共成功提纯并生成了 ${openmojiMap.length} 个 OpenMoji 手绘表情！`);
}

buildOpenMojiMap().catch(err => console.error('❌ 发生错误:', err));