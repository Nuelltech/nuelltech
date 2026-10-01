const CACHE_NAME = 'nuelltech-card-v1';
const ASSETS_TO_CACHE = [
  '/c/nuno-miguel',
  '/c/nuno',
  '/c',
  '/logo-tight.png',
  '/team/nuno-miguel.jpg',
  '/icons/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Alguns assets falharam pré-cache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Ignorar pedidos que não sejam GET
  if (event.request.method !== 'GET') return;

  // Estratégia: Network First com fallback instantâneo para Cache
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Se a resposta for válida, clonar e guardar na cache
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Modo Offline: tentar encontrar o recurso na cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Se for navegação de página html, entregar o cartão em cache
        if (event.request.mode === 'navigate') {
          const cardPageCache = await caches.match('/c/nuno-miguel');
          if (cardPageCache) {
            return cardPageCache;
          }
        }

        return new Response('Sem ligação à internet', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      })
  );
});
