// app.js - 核心底座模块
const GITHUB_USERNAME = 'YourUsername'; 
const REPO_NAME = 'emoji-hub';
const CDN_BASE = `https://cdn.jsdelivr.net/gh/${GITHUB_USERNAME}/${REPO_NAME}@main/`;

// 🚀 全局状态引擎 (核心升级)
window.APP_MODE = 'NORMAL'; // 模式：'NORMAL'(查资料) | 'CIPHER'(密文创作台)

let globalEmojiData = [];       
let currentFilteredData = [];   
let currentSelectedEmoji = null;
let currentCategory = 'All';    

const CHUNK_SIZE = 150;         
let currentRenderCount = 0;     
let searchTimeout = null;       

const emojiGrid = document.getElementById('emojiGrid');
const searchInput = document.getElementById('searchInput');
const categoryNav = document.getElementById('categoryNav');
const stats = document.getElementById('stats');
const loadingSentinel = document.getElementById('loadingSentinel');
const loadingSpinner = document.getElementById('loadingSpinner');
const copyToast = new bootstrap.Toast(document.getElementById('copyToast'));
const emojiModal = new bootstrap.Modal(document.getElementById('emojiModal'));

async function init() {
    const isIntercepted = CipherModule.checkAndIntercept();
    if (!isIntercepted) {
        await window.loadCoreSystem();
    }
}

window.loadCoreSystem = async function() {
    try {
        const response = await fetch('data/emoji-map.json');
        globalEmojiData = await response.json();
        
        renderCategories();
        
        searchInput.addEventListener('input', handleSearchDebounced);
        setupIntersectionObserver();
        emojiGrid.addEventListener('click', handleGridClick);
        document.querySelectorAll('.copy-btn').forEach(btn => btn.addEventListener('click', handleCopy));
        
        // 🚀 初始化应用与模式控制
        CipherModule.initMixerPanel();
        filterAndRender();
    } catch (error) {
        console.error('加载失败:', error);
        stats.innerText = '❌ 数据加载失败。';
    }
}

/* 瀑布流渲染逻辑 (保持原样) */
function renderCategories() {
    const categories = ['All', ...new Set(globalEmojiData.map(item => item.category))];
    let html = '';
    categories.forEach(cat => {
        const displayName = cat.replace(/&/g, ' & ');
        const activeClass = cat === 'All' ? 'btn-primary' : 'btn-outline-secondary';
        html += `<button class="btn btn-sm ${activeClass} rounded-pill text-nowrap cat-btn" data-cat="${cat}">${displayName}</button>`;
    });
    categoryNav.innerHTML = html;
    categoryNav.addEventListener('click', (e) => {
        if (e.target.classList.contains('cat-btn')) {
            document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.replace('btn-primary', 'btn-outline-secondary'));
            e.target.classList.replace('btn-outline-secondary', 'btn-primary');
            currentCategory = e.target.getAttribute('data-cat');
            filterAndRender();
        }
    });
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
        // 🚀 去掉了外层的 <div class="col">，直接输出 card 交给完美网格排列
        html += `<div class="emoji-card" data-id="${item.id}"><img src="${item.svg_url}" alt="${item.id}" loading="lazy" onload="this.classList.add('loaded')"></div>`;
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

// 🚀 核心升级：模式分流点击事件
function handleGridClick(e) {
    const card = e.target.closest('.emoji-card');
    if (!card) return;
    const id = card.getAttribute('data-id');
    const clickedEmoji = globalEmojiData.find(item => item.id === id);
    if (!clickedEmoji) return;

    if (window.APP_MODE === 'CIPHER') {
        // [应用模式]: 微信打字体验，盲打直入，并给卡片一个缩小动画反馈
        CipherModule.addEmoji(clickedEmoji.char);
        card.classList.add('clicked-feedback');
        setTimeout(() => card.classList.remove('clicked-feedback'), 150);
    } else {
        // [查阅模式]: 保持原有的详情与复制弹窗
        currentSelectedEmoji = clickedEmoji;
        document.getElementById('modalTitle').innerText = currentSelectedEmoji.id.replace(/_/g, ' ').toUpperCase();
        document.getElementById('modalImg').src = currentSelectedEmoji.svg_url;
        document.getElementById('modalChar').innerText = currentSelectedEmoji.char;
        emojiModal.show();
    }
}

function handleCopy(e) {
    if (!currentSelectedEmoji) return;
    const type = e.target.getAttribute('data-type');
    const isLocal = GITHUB_USERNAME === 'YourUsername';
    const baseUrl = isLocal ? window.location.origin + '/' : CDN_BASE;
    let textToCopy = '';
    switch (type) {
        case 'char': textToCopy = currentSelectedEmoji.char; break;
        case 'png': textToCopy = baseUrl + currentSelectedEmoji.png_url; break;
        case 'svg': textToCopy = baseUrl + currentSelectedEmoji.svg_url; break;
    }
    navigator.clipboard.writeText(textToCopy).then(() => {
        emojiModal.hide();
        copyToast.show();
    });
}

init();