// build-fluent.js - Microsoft Fluent Emoji 资产洗劫与构建脚本
const fs = require('fs');
const path = require('path');

// 配置路径
const FLUENT_REPO = path.join(__dirname, 'temp_fluent', 'assets');
const OUTPUT_JSON = path.join(__dirname, 'data', 'fluent.json');
const OUT_SVG = path.join(__dirname, 'assets', 'fluent', 'svg');
const OUT_PNG = path.join(__dirname, 'assets', 'fluent', 'png_64x64');

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

function buildFluentMap() {
    console.log('🚀 [1/3] 开始扫描微软 Fluent 资源库...');
    
    if (!fs.existsSync(FLUENT_REPO)) {
        console.error('❌ 找不到 temp_fluent 文件夹，请先执行 git clone!');
        return;
    }

    const dirs = fs.readdirSync(FLUENT_REPO).filter(f => fs.statSync(path.join(FLUENT_REPO, f)).isDirectory());
    const fluentMap = [];

    console.log(`📂 [2/3] 发现 ${dirs.length} 个原始表情，正在提取 3D 资产与元数据...`);

    for (const dirName of dirs) {
        const fullPath = path.join(FLUENT_REPO, dirName);
        const metaPath = path.join(fullPath, 'metadata.json');
        
        // 读取微软提供的官方元数据
        if (!fs.existsSync(metaPath)) continue;
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        
        // 微软的 unicode 是用空格分隔的，我们将其转为短横线，并过滤掉 fe0f 变体符
        if (!meta.unicode) continue;
        const hex = meta.unicode.split(' ').filter(h => h !== 'fe0f').join('-');
        
        // 获取所有图片 (优先获取 Default 默认肤色，避免肤色变体爆炸)
        const allPngs = getFiles(fullPath, '.png').filter(p => p.includes('Default') || !p.includes('Skintones'));
        const allSvgs = getFiles(fullPath, '.svg').filter(p => p.includes('Default') || !p.includes('Skintones'));

        // 🧠 智能优选算法：PNG 优先拿 3D，没有 3D 拿 Color；SVG 优先拿 Color，没有拿 Flat
        const chosenPng = allPngs.find(p => p.includes('3D')) || allPngs.find(p => p.includes('Color')) || allPngs[0];
        const chosenSvg = allSvgs.find(p => p.includes('Color')) || allSvgs.find(p => p.includes('Flat')) || allSvgs[0];

        if (chosenPng && chosenSvg) {
            // 复制并重命名文件
            fs.copyFileSync(chosenPng, path.join(OUT_PNG, `${hex}.png`));
            fs.copyFileSync(chosenSvg, path.join(OUT_SVG, `${hex}.svg`));

            // 构建符合 Emoji-Hub 规范的节点数据
            fluentMap.push({
                id: (meta.cldr || dirName).replace(/\s+/g, '_').toLowerCase(),
                char: meta.glyph || '',
                category: meta.group || 'Symbols',
                keywords: meta.keywords || [],
                svg_url: `assets/fluent/svg/${hex}.svg`,
                png_url: `assets/fluent/png_64x64/${hex}.png`
            });
        }
    }

    console.log('💾 [3/3] 正在生成 fluent.json 数据大脑...');
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(fluentMap, null, 2), 'utf-8');
    
    console.log(`🎉 任务完成！共成功提纯并生成了 ${fluentMap.length} 个 Microsoft Fluent 3D 表情！`);
}

buildFluentMap();