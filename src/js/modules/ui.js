/* ==========================================
   klipza.ia - UI Utilities
   ========================================== */

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
}

function openSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.add('active');
    closeSidebar();
    AccountDeletion.updateDeletionUI();
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.remove('active');
}

function toggleSwitch(el) {
    el.classList.toggle('active');
    const isActive = el.classList.contains('active');
    el.setAttribute('aria-checked', isActive.toString());
    if (el.id === 'focusModeToggle') {
        AppState.settings.focusMode = isActive;
        initParticles();
        saveUserData();
    }
}

function confirmClearHistory() {
    showConfirm('Apagar todo o historico?', 'Todas as conversas serao removidas permanentemente.', () => {
        AppState.chats = {};
        saveUserData();
        createNewChat();
        closeSettings();
        showToast('Historico apagado.');
    });
}

function exportHistory() {
    let text = `Historico klipza.ia - ${AppState.currentUser?.username || 'Usuario'}\n`;
    text += `Exportado em: ${new Date().toLocaleString('pt-BR')}\n`;
    text += '='.repeat(60) + '\n\n';
    const chatIds = Object.keys(AppState.chats).sort((a,b) => AppState.chats[a].createdAt - AppState.chats[b].createdAt);
    chatIds.forEach(id => {
        const chat = AppState.chats[id];
        text += `\n### ${chat.title}\n`;
        text += `Data: ${new Date(chat.createdAt).toLocaleString('pt-BR')}\n\n`;
        chat.messages.forEach(msg => {
            text += `[${msg.time}] ${msg.author}: ${msg.text}\n\n`;
        });
        text += '-'.repeat(60) + '\n';
    });
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `klipza-historico-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Historico exportado.');
}

let confirmCallback = null;

function showConfirm(title, message, callback) {
    const modal = document.getElementById('confirmModal');
    const titleEl = document.getElementById('confirmTitle');
    const msgEl = document.getElementById('confirmMsg');
    if (!modal || !titleEl || !msgEl) return;
    titleEl.textContent = title;
    msgEl.textContent = message;
    confirmCallback = callback;
    modal.classList.add('active');
}

function closeConfirm() {
    const modal = document.getElementById('confirmModal');
    if (modal) modal.classList.remove('active');
    confirmCallback = null;
}

function confirmAction() {
    if (confirmCallback) confirmCallback();
    closeConfirm();
}

function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function scrollToBottom() {
    const wrapper = document.getElementById('messagesWrapper');
    if (wrapper) {
        requestAnimationFrame(() => {
            wrapper.scrollTop = wrapper.scrollHeight;
        });
    }
}
