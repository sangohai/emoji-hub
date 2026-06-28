// build-noto.js - Google Noto Emoji 资产洗劫与构建脚本
const fs = require('fs');
const path = require('path');

// 路径配置
const NOTO_REPO = path.join(__dirname, 'temp_noto');
const OUT_SVG = path.join(__dirname, 'assets', 'noto', 'svg');
const OUT_PNG = path.join(__dirname, 'assets', 'noto', 'png_64x64');
const OUTPUT_JSON = path.join(__dirname, 'data', 'noto.json');

// Gemoji 字典 API
const GEMOJI_URL = 'https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json';

// 创建专属文件夹
fs.mkdirSync(OUT_SVG, { recursive: true });
fs.mkdirSync(OUT_PNG, { recursive: true });

// 递归查找文件的小工具
function getFiles(dir, ext) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(fullPath, ext));
        } else if (fullPath.endsWith(ext)) {
            results.push(fullPath);
        }
    });
    return results;
}

async function buildNotoMap() {
    console.log('🚀 [1/4] 正在从云端抓取 Emoji 语义元数据...');
    const response = await fetch(GEMOJI_URL);
    const gemojiData = await response.json();

    // 建立 Unicode 到元数据的映射字典
    const metaDict = {};
    for (const item of gemojiData) {
        if (!item.emoji) continue;
        const hexPoints = Array.from(item.emoji)
            .map(c => c.codePointAt(0).toString(16))
            .filter(h => h !== 'fe0f') // 过滤掉变体符
            .join('-');
        metaDict[hexPoints] = item;
    }

    console.log('📂 [2/4] 开始扫描 Google Noto 资源库...');
    if (!fs.existsSync(NOTO_REPO)) {
        console.error('❌ 找不到 temp_noto 文件夹，请先执行 git clone!');
        return;
    }

    // Noto 的彩色图片主要在 svg 文件夹和 png/128 文件夹
    const svgFiles = getFiles(path.join(NOTO_REPO, 'svg'), '.svg');
    const pngFiles = getFiles(path.join(NOTO_REPO, 'png'), '.png');

    // 建立 PNG 快速查找字典
    const pngDict = {};
    pngFiles.forEach(p => { pngDict[path.basename(p)] = p; });

    const notoMap = [];
    console.log(`🧠 [3/4] 开始智能匹配并提取资产...`);

    for (const svgPath of svgFiles) {
        const filename = path.basename(svgPath);
        // Google 命名法: emoji_u1f600.svg -> 转换为标准 hex: 1f600
        if (!filename.startsWith('emoji_u')) continue;
        
        const standardHex = filename.replace('emoji_u', '').replace('.svg', '').replace(/_/g, '-');
        
        // 只收录在基础字典里的表情 (自动过滤掉繁杂的肤色变体，保持轻量级)
        const meta = metaDict[standardHex];
        if (meta) {
            const pngPath = pngDict[filename.replace('.svg', '.png')];
            
            if (pngPath) {
                // 拷贝并重命名为标准格式
                fs.copyFileSync(svgPath, path.join(OUT_SVG, `${standardHex}.svg`));
                fs.copyFileSync(pngPath, path.join(OUT_PNG, `${standardHex}.png`));

                notoMap.push({
                    id: meta.aliases[0] || 'unknown',
                    char: meta.emoji,
                    category: meta.category || 'Symbols',
                    keywords: [...new Set([...(meta.tags || []), meta.aliases[0]])],
                    svg_url: `assets/noto/svg/${standardHex}.svg`,
                    png_url: `assets/noto/png_64x64/${standardHex}.png`
                });
            }
        }
    }

    console.log('💾 [4/4] 正在生成 noto.json 数据大脑...');
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(notoMap, null, 2), 'utf-8');
    
    console.log(`🎉 任务完成！共成功提纯并生成了 ${notoMap.length} 个 Google Noto 原生表情！`);
}

buildNotoMap().catch(err => console.error('❌ 发生错误:', err));