/* ==========================================
   klipza.ia - Auth System
   ========================================== */

function checkAuthState() {
    const session = Storage.get('klipza_session');
    if (session && session.username) {
        const users = Storage.get('klipza_users') || {};
        if (users[session.username]) {
            AppState.currentUser = users[session.username];
            AccountDeletion.checkAndExecute();
            if (AppState.currentUser) {
                loadUserData();
                showApp();
                return;
            }
        }
    }
    showAuth();
}

function showAuth() {
    const authScreen = document.getElementById('authScreen');
    const appContainer = document.getElementById('appContainer');
    if (authScreen) authScreen.classList.remove('hidden');
    if (appContainer) appContainer.classList.remove('visible');
}

function showApp() {
    const authScreen = document.getElementById('authScreen');
    const appContainer = document.getElementById('appContainer');
    if (authScreen) authScreen.classList.add('hidden');
    if (appContainer) appContainer.classList.add('visible');
    renderSidebar();
    TokenSystem.updateUI();
    TokenSystem.startCountdown();
    AccountDeletion.updateDeletionUI();
    AccountDeletion.startDeletionCheck();
    if (!AppState.currentChatId || !AppState.chats[AppState.currentChatId]) {
        createNewChat();
    } else {
        loadChat(AppState.currentChatId);
    }
}

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const svgEye = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    const svgEyeOff = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A12 12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

    if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = svgEyeOff;
    } else {
        input.type = 'password';
        btn.innerHTML = svgEye;
    }
}

function showError(message) {
    const errorEl = document.getElementById('authError');
    const msgEl = document.getElementById('authErrorMessage');
    if (!errorEl || !msgEl) return;

    msgEl.textContent = message;
    errorEl.classList.remove('show');
    void errorEl.offsetWidth;
    errorEl.classList.add('show');
    setTimeout(() => errorEl.classList.remove('show'), 4000);
}

function checkPasswordStrength(password) {
    const bar = document.getElementById('passwordStrengthBar');
    if (!bar) return;

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const percent = (strength / 5) * 100;
    bar.style.width = percent + '%';
    if (percent < 40) bar.style.background = '#ff5555';
    else if (percent < 70) bar.style.background = '#ffaa55';
    else bar.style.background = '#55ff88';
}

function loadUserData() {
    if (!AppState.currentUser) return;

    const userNameEl = document.getElementById('userName');
    const userAvatarEl = document.getElementById('userAvatar');
    const settingsUsername = document.getElementById('settingsUsername');
    const settingsEmail = document.getElementById('settingsEmail');
    const settingsMemberSince = document.getElementById('settingsMemberSince');

    if (userNameEl) userNameEl.textContent = AppState.currentUser.username;
    if (userAvatarEl) userAvatarEl.textContent = AppState.currentUser.username.charAt(0).toUpperCase();
    if (settingsUsername) settingsUsername.textContent = AppState.currentUser.username;
    if (settingsEmail) settingsEmail.textContent = AppState.currentUser.email;
    if (settingsMemberSince) settingsMemberSince.textContent = new Date(AppState.currentUser.createdAt).toLocaleDateString('pt-BR');

    const userData = Storage.get(`klipza_data_${AppState.currentUser.username}`);
    if (userData) {
        AppState.chats = userData.chats || {};
        AppState.settings = { ...AppState.settings, ...(userData.settings || {}) };
        AppState.currentChatId = userData.currentChatId || null;
    } else {
        AppState.chats = {};
        AppState.currentChatId = null;
    }

    const particleDensity = document.getElementById('particleDensity');
    const focusModeToggle = document.getElementById('focusModeToggle');
    if (particleDensity) particleDensity.value = AppState.settings.particleDensity;
    if (focusModeToggle) {
        if (AppState.settings.focusMode) {
            focusModeToggle.classList.add('active');
            focusModeToggle.setAttribute('aria-checked', 'true');
        } else {
            focusModeToggle.classList.remove('active');
            focusModeToggle.setAttribute('aria-checked', 'false');
        }
    }
    initParticles();
    ModelSystem.init();
}

function saveUserData() {
    if (!AppState.currentUser) return;
    Storage.set(`klipza_data_${AppState.currentUser.username}`, {
        chats: AppState.chats,
        settings: AppState.settings,
        currentChatId: AppState.currentChatId
    });
}

function confirmLogout() {
    showConfirm('Sair da conta?', 'Voce precisara fazer login novamente.', () => {
        logout();
    });
}

function logout() {
    Storage.remove('klipza_session');
    if (TokenSystem.countdownInterval) clearInterval(TokenSystem.countdownInterval);
    if (AccountDeletion.checkInterval) clearInterval(AccountDeletion.checkInterval);
    AppState.currentUser = null;
    AppState.chats = {};
    AppState.currentChatId = null;
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm) loginForm.reset();
    if (registerForm) registerForm.reset();
    showAuth();
    showToast('Voce sapu da conta.');
}

function confirmDeleteAccount() {
    showConfirm(
        'Excluir Conta Permanentemente?',
        'Ao confirmar, sua conta sera marcada para exclusao. Apos 24 horas, todos os seus dados serao removidos permanentemente e nao poderao ser recuperados. Deseja prosseguir?',
        () => {
            AccountDeletion.scheduleDeletion();
            closeSettings();
        }
    );
}

function cancelDeletion() {
    showConfirm(
        'Cancelar Exclusao da Conta?',
        'Sua conta nao sera mais excluida. Todos os dados serao mantidos normalmente.',
        () => {
            AccountDeletion.cancelDeletion();
        }
    );
}
