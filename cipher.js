// cipher.js - Emoji 密码机与裂变模块
const CipherModule = {
    combination: [],
    currentSecretPayload: null, // 存储当前拦截到的密文对象

    ui: {
        overlay: document.getElementById('decodeOverlay'),
        loading: document.getElementById('decodeLoading'),
        passwordScreen: document.getElementById('decodePasswordScreen'),
        content: document.getElementById('decodeContent'),
        error: document.getElementById('decodeError'),
        
        emojiDisplay: document.getElementById('decodeEmoji'),
        meaningDisplay: document.getElementById('decodeMeaning'),
        lockEmojiPreview: document.getElementById('lockEmojiPreview'),
        passInput: document.getElementById('decodePasswordInput'),
        
        appZone: document.getElementById('appZone'),
        cipherStudio: document.getElementById('cipherStudio'),
        mixerDisplay: document.getElementById('mixerDisplay'),
        mixerMeaning: document.getElementById('mixerMeaning'),
        mixerPassword: document.getElementById('mixerPassword'),
        cipherResult: document.getElementById('cipherResult'),
    },

    checkAndIntercept() {
        this.ui.overlay.style.display = 'none'; 
        const urlParams = new URLSearchParams(window.location.search);
        const cipherText = urlParams.get('cipher');
        if (cipherText) {
            this.handleDecoding(cipherText);
            return true; 
        }
        return false;
    },

    handleDecoding(cipherText) {
        this.ui.overlay.style.display = 'flex';
        this.ui.loading.style.display = 'block';

        setTimeout(() => {
            try {
                const decodedStr = decodeURIComponent(atob(cipherText));
                this.currentSecretPayload = JSON.parse(decodedStr);
                this.ui.loading.style.display = 'none';

                // 🚀 判断是否有密码锁
                if (this.currentSecretPayload.p) {
                    this.ui.lockEmojiPreview.innerText = this.currentSecretPayload.e;
                    this.ui.passwordScreen.style.display = 'block';
                } else {
                    this.showReveal();
                }
            } catch (e) {
                console.error("解密失败:", e);
                this.ui.loading.style.display = 'none';
                this.ui.error.style.display = 'block';
            }
        }, 1200);

        // 绑定解锁按钮
        document.getElementById('unlockBtn').onclick = () => this.verifyPassword();
        
        // 绑定进入系统按钮
        const closeOverlay = () => {
            this.ui.overlay.style.display = 'none';
            window.history.replaceState({}, document.title, window.location.pathname);
            window.loadCoreSystem(); 
        };
        document.getElementById('enterAppBtn').onclick = closeOverlay;
        document.getElementById('errorEnterAppBtn').onclick = closeOverlay;
    },

    verifyPassword() {
        const input = this.ui.passInput.value.trim();
        if (input === this.currentSecretPayload.p) {
            this.ui.passwordScreen.style.display = 'none';
            this.showReveal();
        } else {
            // 密码错误，震动反馈
            this.ui.passInput.classList.add('border-danger', 'text-danger', 'shake-animation');
            setTimeout(() => {
                this.ui.passInput.classList.remove('shake-animation');
            }, 400);
            this.ui.passInput.value = '';
            this.ui.passInput.placeholder = '❌ 密码错误，请重试';
        }
    },

    showReveal() {
        this.ui.emojiDisplay.innerText = this.currentSecretPayload.e;
        this.ui.meaningDisplay.innerText = this.currentSecretPayload.m;
        this.ui.content.style.display = 'block';
    },

    initMixerPanel() {
        document.getElementById('enterCipherAppBtn').onclick = () => {
            window.APP_MODE = 'CIPHER';
            this.ui.appZone.style.display = 'none';
            this.ui.cipherStudio.style.display = 'block';
        };

        document.getElementById('exitCipherAppBtn').onclick = () => {
            window.APP_MODE = 'NORMAL';
            this.ui.cipherStudio.style.display = 'none';
            this.ui.appZone.style.display = 'block';
            this.clearMixer(); 
        };

        document.getElementById('clearMixerBtn').onclick = () => this.clearMixer();
        document.getElementById('generateCipherBtn').onclick = () => this.generateCipher();
        document.getElementById('copyCipherBtn').onclick = () => this.copyCipherLink();
    },

    addEmoji(char) {
        if (this.combination.length >= 30) return alert("⚠️ 组合太长了！");
        this.combination.push(char);
        this.updateUI();
    },

    clearMixer() {
        this.combination = [];
        this.ui.mixerMeaning.value = '';
        this.ui.mixerPassword.value = '';
        this.ui.cipherResult.style.display = 'none';
        this.updateUI();
    },

    updateUI() {
        this.ui.mixerDisplay.innerText = this.combination.length > 0 ? this.combination.join('') : '[空]';
    },

    generateCipher() {
        if (this.combination.length === 0) return alert("⚠️ 请点击下方表情加入组合！");
        const meaning = this.ui.mixerMeaning.value.trim();
        if (!meaning) return alert("⚠️ 请输入这组表情的真实含义！");
        
        const pwd = this.ui.mixerPassword.value.trim();
        const payload = { e: this.combination.join(''), m: meaning };
        if (pwd) payload.p = pwd; // 加入口令锁

        const cipherText = btoa(encodeURIComponent(JSON.stringify(payload)));
        this.shareUrl = `${window.location.origin}${window.location.pathname}?cipher=${cipherText}`;
        
        this.updateSocialLinks();
        this.ui.cipherResult.style.display = 'block';
    },

    updateSocialLinks() {
        const text = encodeURIComponent(`🕵️ 朋友给我发了一段神秘 Emoji 密码，你能解开吗？`);
        const url = encodeURIComponent(this.shareUrl);
        
        document.getElementById('shareX').href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        document.getElementById('shareFB').href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        document.getElementById('shareReddit').href = `https://reddit.com/submit?url=${url}&title=${text}`;
        document.getElementById('shareWA').href = `https://api.whatsapp.com/send?text=${text}%20${url}`;
    },

    copyCipherLink() {
        navigator.clipboard.writeText(this.shareUrl).then(() => {
            const btn = document.getElementById('copyCipherBtn');
            btn.innerText = '✅ 已复制！去粘贴吧';
            setTimeout(() => btn.innerText = '📄 复制私发', 3000);
        });
    }
};