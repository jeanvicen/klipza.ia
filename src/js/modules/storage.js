/* ==========================================
   klipza.ia - Storage & Crypto Utilities
   ========================================== */

const Storage = {
    get: (key) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn('Storage read error:', e);
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage write error:', e);
            if (e.name === 'QuotaExceededError') {
                showToast('Armazenamento cheio. Limpe o historico.');
            }
            return false;
        }
    },
    remove: (key) => {
        try { localStorage.removeItem(key); } catch (e) {}
    },
    clear: () => {
        try { localStorage.clear(); } catch (e) {}
    }
};

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'klipza_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
