// app.js - 核心底座模块 (Multiverse V3.0)

// 🚀 1. 全局配置与 CDN 激活
const GITHUB_USERNAME = 'sangohai'; 
const REPO_NAME = 'emoji-hub';
const CDN_BASE = `https://cdn.jsdelivr.net/gh/${GITHUB_USERNAME}/${REPO_NAME}@main/`;

// 🚀 2. 全局状态引擎 (State Machine)
window.APP_MODE = 'NORMAL';        // 模式：'NORMAL'(查资料) | 'CIPHER'(密文创作台)
window.CURRENT_BRAND = 'twemoji';  // 厂牌宇宙：twemoji | fluent | noto | openmoji
window.eventsBound = false;        // 防止事件重复绑定的锁

let globalEmojiData = [];       
let currentFilteredData = [];   
let currentSelectedEmoji = null;
let currentCategory = 'All';    

// 性能控制
const CHUNK_SIZE = 150;         
let currentRenderCount = 0;     
let searchTimeout = null;       

// DOM 元素缓存
const emojiGrid = document.getElementById('emojiGrid');
const searchInput = document.getElementById('searchInput');
const categoryNav = document.getElementById('categoryNav');
const stats = document.getElementById('stats');
const loadingSentinel = document.getElementById('loadingSentinel');
const loadingSpinner = document.getElementById('loadingSpinner');
const copyToast = new bootstrap.Toast(document.getElementById('copyToast'));
const emojiModal = new bootstrap.Modal(document.getElementById('emojiModal'));

// --- 🔧 智能路径修正工具 ---
// 兼容旧版 JSON 数据，自动为资产路径补全当前的厂牌目录
function getAssetUrl(originalUrl) {
    if (originalUrl.includes(`assets/${window.CURRENT_BRAND}/`)) {
        return originalUrl; // 已经是新标准路径，直接返回
    }
    // 将 assets/svg/xxx 修正为 assets/twemoji/svg/xxx
    return originalUrl.replace('assets/', `assets/${window.CURRENT_BRAND}/`);
}

// --- 🎬 入口与厂牌切换路由 ---
async function init() {
    const isIntercepted = CipherModule.checkAndIntercept();
    if (!isIntercepted) {
        // 绑定顶层厂牌 Tag 切换事件
        document.getElementById('brandTabs').addEventListener('click', async (e) => {
            const tag = e.target.closest('.brand-tag');
            if (!tag || tag.classList.contains('active')) return;
            
            // 切换 UI 状态
            document.querySelectorAll('.brand-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            
            // 切换宇宙，触发核心重载
            window.CURRENT_BRAND = tag.getAttribute('data-brand');
            await window.loadCoreSystem();
        });

        // 初始加载默认宇宙 (Twemoji)
        await window.loadCoreSystem();
    }
}

// --- 🧠 核心系统加载 (支持多字典热切换) ---
window.loadCoreSystem = async function() {
    try {
        // 切换前清空界面与状态
        emojiGrid.innerHTML = ''; 
        loadingSpinner.style.display = 'inline-block';
        stats.innerText = `正在连接 ${window.CURRENT_BRAND.toUpperCase()} 宇宙数据...`;

        // 动态加载当前厂牌的 JSON 字典
        const response = await fetch(`data/${window.CURRENT_BRAND}.json`);
        if (!response.ok) throw new Error('未找到资源');
        
        globalEmojiData = await response.json();
        
        // 单例绑定基础事件 (全局只绑定一次)
        if (!window.eventsBound) {
            searchInput.addEventListener('input', handleSearchDebounced);
            setupIntersectionObserver();
            emojiGrid.addEventListener('click', handleGridClick);
            document.querySelectorAll('.copy-btn').forEach(btn => btn.addEventListener('click', handleCopy));
            CipherModule.initMixerPanel();
            window.eventsBound = true;
        }

        // 重新渲染该厂牌的分类和数据
        renderCategories();
        filterAndRender();
        
    } catch (error) {
        console.error('加载失败:', error);
        emojiGrid.innerHTML = '';
        stats.innerHTML = `⚠️ <b class="text-warning">${window.CURRENT_BRAND.toUpperCase()}</b> 资源库尚未收录。<br>请通知架构师执行爬虫脚本抓取该库资源。`;
        loadingSpinner.style.display = 'none';
        categoryNav.innerHTML = '';
    }
}

// --- 🏷️ 瀑布流渲染逻辑 ---
function renderCategories() {
    const categories = ['All', ...new Set(globalEmojiData.map(item => item.category))];
    let html = '';
    categories.forEach(cat => {
        const displayName = cat.replace(/&/g, ' & ');
        const activeClass = cat === 'All' ? 'btn-primary' : 'btn-outline-secondary';
        html += `<button class="btn btn-sm ${activeClass} rounded-pill text-nowrap cat-btn" data-cat="${cat}">${displayName}</button>`;
    });
    categoryNav.innerHTML = html;
    
    // 分类切换事件 (先解绑再绑，防止重复，但用委托其实绑一次就够，这里做安全替换)
    categoryNav.onclick = (e) => {
        if (e.target.classList.contains('cat-btn')) {
            document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.replace('btn-primary', 'btn-outline-secondary'));
            e.target.classList.replace('btn-outline-secondary', 'btn-primary');
            currentCategory = e.target.getAttribute('data-cat');
            filterAndRender();
        }
    };
}

function filterAndRender() {
    const keyword = searchInput.value.toLowerCase().trim();
    currentFilteredData = globalEmojiData.filter(item => {
        const matchCategory = (currentCategory === 'All' || item.category === currentCategory);
        const matchKeyword = (!keyword || item.id.toLowerCase().includes(keyword) || item.keywords.some(k => k.toLowerCase().includes(keyword)));
        return matchCategory && matchKeyword;
    });
    emojiGrid.innerHTML = '';
    currentRenderCount = 0;
    stats.innerText = `当前检索到 ${currentFilteredData.length} 个资产`;
    loadMoreChunks();
}

function loadMoreChunks() {
    if (currentRenderCount >= currentFilteredData.length) { loadingSpinner.style.display = 'none'; return; }
    loadingSpinner.style.display = 'inline-block';
    const nextBatch = currentFilteredData.slice(currentRenderCount, currentRenderCount + CHUNK_SIZE);
    
    let html = '';
    nextBatch.forEach(item => {
        // 使用 getAssetUrl 修正图片路径
        const svgPath = getAssetUrl(item.svg_url);
        html += `<div class="emoji-card" data-id="${item.id}"><img src="${svgPath}" alt="${item.id}" loading="lazy" onload="this.classList.add('loaded')"></div>`;
    });
    
    emojiGrid.insertAdjacentHTML('beforeend', html);
    currentRenderCount += nextBatch.length;
    
    if (currentRenderCount >= currentFilteredData.length) loadingSpinner.style.display = 'none';
}

function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) loadMoreChunks();
    }, { rootMargin: '200px' });
    observer.observe(loadingSentinel);
}

function handleSearchDebounced() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => filterAndRender(), 200);
}

// --- 🖱️ 点击路由分发 (查询详情 vs 密文输入) ---
function handleGridClick(e) {
    const card = e.target.closest('.emoji-card');
    if (!card) return;
    const id = card.getAttribute('data-id');
    const clickedEmoji = globalEmojiData.find(item => item.id === id);
    if (!clickedEmoji) return;

    if (window.APP_MODE === 'CIPHER') {
        // [密文应用模式]
        CipherModule.addEmoji(clickedEmoji.char);
        card.classList.add('clicked-feedback');
        setTimeout(() => card.classList.remove('clicked-feedback'), 150);
    } else {
        // [查资料模式]
        currentSelectedEmoji = clickedEmoji;
        const svgPath = getAssetUrl(currentSelectedEmoji.svg_url);
        
        // 从原始路径提取出 Hex Code (如 1f40d)
        const hexCode = currentSelectedEmoji.svg_url.split('/').pop().replace('.svg', '');
        
        document.getElementById('modalTitle').innerText = currentSelectedEmoji.id.replace(/_/g, ' ').toUpperCase();
        document.getElementById('modalImg').src = svgPath;
        document.getElementById('modalChar').innerText = currentSelectedEmoji.char;
        
        // 填充你要求的 HEX 编码
        const hexElement = document.getElementById('modalHexCode');
        if (hexElement) hexElement.innerText = `HEX: ${hexCode}`;
        
        emojiModal.show();
    }
}

// --- 📄 CDN 复制中心 ---
function handleCopy(e) {
    if (!currentSelectedEmoji) return;
    const type = e.target.getAttribute('data-type');
    
    const isLocal = GITHUB_USERNAME === 'YourUsername' || GITHUB_USERNAME === '';
    let localBase = window.location.origin + window.location.pathname;
    localBase = localBase.replace(/\/[^\/]*$/, '/'); 
    const baseUrl = isLocal ? localBase : CDN_BASE;
    
    let textToCopy = '';
    // 同样使用 getAssetUrl 保证复制出来的路径也带厂牌目录
    switch (type) {
        case 'char': 
            textToCopy = currentSelectedEmoji.char; 
            break;
        case 'png': 
            textToCopy = baseUrl + getAssetUrl(currentSelectedEmoji.png_url); 
            break;
        case 'svg': 
            textToCopy = baseUrl + getAssetUrl(currentSelectedEmoji.svg_url); 
            break;
    }
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        emojiModal.hide();
        copyToast.show();
    });
}

// 启动引擎！
init();