// app.js - 核心底座模块
// 🚀 1. 彻底激活 CDN：这里已经替换成了你的真实 GitHub 用户名！
const GITHUB_USERNAME = 'sangohai'; 
const REPO_NAME = 'emoji-hub';
const CDN_BASE = `https://cdn.jsdelivr.net/gh/${GITHUB_USERNAME}/${REPO_NAME}@main/`;

window.APP_MODE = 'NORMAL'; 
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
        
        CipherModule.initMixerPanel();
        filterAndRender();
    } catch (error) {
        console.error('加载失败:', error);
        stats.innerText = '❌ 数据加载失败。';
    }
}

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

function handleGridClick(e) {
    const card = e.target.closest('.emoji-card');
    if (!card) return;
    const id = card.getAttribute('data-id');
    const clickedEmoji = globalEmojiData.find(item => item.id === id);
    if (!clickedEmoji) return;

    if (window.APP_MODE === 'CIPHER') {
        CipherModule.addEmoji(clickedEmoji.char);
        card.classList.add('clicked-feedback');
        setTimeout(() => card.classList.remove('clicked-feedback'), 150);
    } else {
        currentSelectedEmoji = clickedEmoji;
        document.getElementById('modalTitle').innerText = currentSelectedEmoji.id.replace(/_/g, ' ').toUpperCase();
        document.getElementById('modalImg').src = currentSelectedEmoji.svg_url;
        document.getElementById('modalChar').innerText = currentSelectedEmoji.char;
        emojiModal.show();
    }
}

// 🚀 2. 修复复制路径的智能拼接逻辑
function handleCopy(e) {
    if (!currentSelectedEmoji) return;
    const type = e.target.getAttribute('data-type');
    
    const isLocal = GITHUB_USERNAME === 'YourUsername' || GITHUB_USERNAME === '';
    
    // 智能获取当前站点的真实根目录 (无论是在本地还是 GitHub Pages 的子目录)
    let localBase = window.location.origin + window.location.pathname;
    // 如果 URL 以 index.html 结尾，将其截断，确保它是一个纯净的目录路径
    localBase = localBase.replace(/\/[^\/]*$/, '/'); 
    
    // 决定最终使用 CDN 还是站点直链
    const baseUrl = isLocal ? localBase : CDN_BASE;
    
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