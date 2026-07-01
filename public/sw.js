/* ==========================================
   klipza.ia - Service Worker
   Cache Strategy: Network First with Cache Fallback
   ========================================== */

const CACHE_NAME = 'klipza-ia-v1.0.0';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/src/css/style.css',
    '/src/js/modules/state.js',
    '/src/js/modules/storage.js',
    '/src/js/modules/tokens.js',
    '/src/js/modules/models.js',
    '/src/js/modules/account.js',
    '/src/js/modules/particles.js',
    '/src/js/modules/chat.js',
    '/src/js/modules/auth.js',
    '/src/js/modules/ui.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

/* ---- Install: Pre-cache critical assets ---- */
self.addEventListener('install', (event) => {
    console.log('[SW] Installing klipza.ia v1.0.0');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching assets');
            return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
                console.warn('[SW] Some assets failed to cache:', err);
            });
        })
    );
    self.skipWaiting();
});

/* ---- Activate: Clean old caches ---- */
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
    );
    self.clients.claim();
});

/* ---- Fetch: Network First, fallback to cache ---- */
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                return response;
            })
            .catch(() => {
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                    return new Response('Offline - Conteudo nao disponivel', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
            })
    );
});

/* ---- Push Notification ---- */
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Nova atualizacao do klipza.ia',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        tag: 'klipza-notification',
        renotify: true,
        data: {
            url: '/'
        }
    };
    event.waitUntil(
        self.registration.showNotification('klipza.ia', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});