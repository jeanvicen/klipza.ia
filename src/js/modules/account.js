/* ==========================================
   klipza.ia - Account Deletion System
   ========================================== */

const AccountDeletion = {
    DELETION_DELAY: 24 * 60 * 60 * 1000,

    scheduleDeletion() {
        if (!AppState.currentUser) return;
        const users = Storage.get('klipza_users') || {};
        const user = users[AppState.currentUser.username];
        if (!user) return;

        user.deletionScheduled = Date.now();
        users[AppState.currentUser.username] = user;
        Storage.set('klipza_users', users);
        AppState.currentUser = user;

        this.updateDeletionUI();
        showToast('Conta marcada para exclusao em 24 horas.');
    },

    cancelDeletion() {
        if (!AppState.currentUser) return;
        const users = Storage.get('klipza_users') || {};
        const user = users[AppState.currentUser.username];
        if (!user) return;

        delete user.deletionScheduled;
        users[AppState.currentUser.username] = user;
        Storage.set('klipza_users', users);
        AppState.currentUser = user;

        this.updateDeletionUI();
        showToast('Exclusao da conta cancelada.');
    },

    checkAndExecute() {
        if (!AppState.currentUser) return;
        const users = Storage.get('klipza_users') || {};
        const user = users[AppState.currentUser.username];
        if (!user || !user.deletionScheduled) return;

        const elapsed = Date.now() - user.deletionScheduled;
        if (elapsed >= this.DELETION_DELAY) {
            delete users[AppState.currentUser.username];
            Storage.set('klipza_users', users);
            Storage.remove(`klipza_data_${AppState.currentUser.username}`);
            Storage.remove(`klipza_tokens_${AppState.currentUser.username}`);
            Storage.remove('klipza_session');
            Storage.remove('klipza_model');

            AppState.currentUser = null;
            AppState.chats = {};
            AppState.currentChatId = null;

            document.getElementById('loginForm').reset();
            document.getElementById('registerForm').reset();
            showAuth();
            showToast('Conta excluida permanentemente.');
        }
    },

    updateDeletionUI() {
        const notice = document.getElementById('deletionNotice');
        const countdownEl = document.getElementById('deletionCountdown');

        if (!AppState.currentUser || !AppState.currentUser.deletionScheduled) {
            if (notice) notice.style.display = 'none';
            return;
        }

        if (notice) notice.style.display = 'block';
        const remaining = this.DELETION_DELAY - (Date.now() - AppState.currentUser.deletionScheduled);

        if (countdownEl) {
            if (remaining <= 0) {
                countdownEl.textContent = 'Exclusao iminente...';
            } else {
                const hours = Math.floor(remaining / (60 * 60 * 1000));
                const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
                countdownEl.textContent = `Conta sera excluida permanentemente em ${hours}h ${minutes}min. Esta acao e irreversivel.`;
            }
        }
    },

    startDeletionCheck() {
        if (this.checkInterval) clearInterval(this.checkInterval);
        this.checkInterval = setInterval(() => {
            this.updateDeletionUI();
            this.checkAndExecute();
        }, 30000);
    }
};
