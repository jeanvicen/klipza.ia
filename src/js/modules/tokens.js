/* ==========================================
   klipza.ia - Token System
   ========================================== */

const TokenSystem = {
    MAX_TOKENS: 100,
    COST_PER_MESSAGE: 2,
    RESET_INTERVAL: 24 * 60 * 60 * 1000,

    getUserTokens() {
        if (!AppState.currentUser) return { tokens: 0, lastReset: 0 };
        const data = Storage.get(`klipza_tokens_${AppState.currentUser.username}`);
        return data || { tokens: this.MAX_TOKENS, lastReset: Date.now() };
    },

    checkAndReset() {
        const tokenData = this.getUserTokens();
        const now = Date.now();
        if (now - tokenData.lastReset >= this.RESET_INTERVAL) {
            tokenData.tokens = this.MAX_TOKENS;
            tokenData.lastReset = now;
            this.saveTokens(tokenData);
        }
        return tokenData;
    },

    canSend() {
        const tokenData = this.checkAndReset();
        return tokenData.tokens >= this.COST_PER_MESSAGE;
    },

    consumeTokens() {
        const tokenData = this.getUserTokens();
        tokenData.tokens = Math.max(0, tokenData.tokens - this.COST_PER_MESSAGE);
        this.saveTokens(tokenData);
        this.updateUI();
        return tokenData;
    },

    saveTokens(tokenData) {
        if (!AppState.currentUser) return;
        Storage.set(`klipza_tokens_${AppState.currentUser.username}`, tokenData);
    },

    getTimeUntilReset() {
        const tokenData = this.getUserTokens();
        const elapsed = Date.now() - tokenData.lastReset;
        return Math.max(0, this.RESET_INTERVAL - elapsed);
    },

    formatCountdown(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },

    updateUI() {
        const tokenData = this.checkAndReset();
        const tokens = tokenData.tokens;
        const badge = document.getElementById('tokenBadge');
        const countEl = document.getElementById('tokenCount');
        const footerCountEl = document.getElementById('tokenFooterCount');
        const blockedNotice = document.getElementById('tokenBlockedNotice');
        const inputContainer = document.getElementById('inputContainer');
        const userInput = document.getElementById('userInput');

        if (!countEl) return;

        countEl.textContent = tokens;
        if (footerCountEl) footerCountEl.textContent = `${tokens}/${this.MAX_TOKENS}`;

        if (badge) {
            badge.classList.remove('low', 'empty');
            if (tokens === 0) badge.classList.add('empty');
            else if (tokens < 20) badge.classList.add('low');
        }

        if (tokens === 0) {
            if (blockedNotice) blockedNotice.classList.add('show');
            if (inputContainer) inputContainer.classList.add('blocked');
            if (userInput) {
                userInput.disabled = true;
                userInput.placeholder = 'Limite diario atingido';
            }
        } else {
            if (blockedNotice) blockedNotice.classList.remove('show');
            if (inputContainer) inputContainer.classList.remove('blocked');
            if (userInput) {
                userInput.disabled = false;
                userInput.placeholder = 'Envie uma mensagem...';
            }
        }
    },

    startCountdown() {
        if (this.countdownInterval) clearInterval(this.countdownInterval);
        this.countdownInterval = setInterval(() => {
            const ms = this.getTimeUntilReset();
            const countdownEl = document.getElementById('tokenCountdown');
            if (countdownEl) {
                countdownEl.textContent = this.formatCountdown(ms);
            }
            if (ms <= 0) {
                this.checkAndReset();
                this.updateUI();
            }
        }, 1000);
    },

    countdownInterval: null
};