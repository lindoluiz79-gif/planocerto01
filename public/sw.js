// Service Worker Avançado - PlanoCerto PWA

const CACHE_NAME = 'planocerto-v2';
const DYNAMIC_CACHE = 'planocerto-dynamic-v2';
const IMAGE_CACHE = 'planocerto-images-v2';

const urlsToCache = [
  '/',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/buscar',
  '/recomendar',
  '/favoritos',
  '/dashboard',
];

// Install - Cache recursos estáticos
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate - Limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Estratégia Network First com fallback para cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requisições de extensões do navegador
  if (url.protocol === 'chrome-extension:') return;

  // Estratégia para imagens: Cache First
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          return response || fetch(request).then((fetchResponse) => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // Estratégia para API e páginas: Network First
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clonar resposta para cache
        const responseClone = response.clone();
        
        if (response.status === 200) {
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        
        return response;
      })
      .catch(() => {
        // Fallback para cache se offline
        return caches.match(request).then((response) => {
          return response || caches.match('/').then((fallback) => {
            return fallback || new Response('Offline - Sem conexão', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
        });
      })
  );
});

// Push Notifications - Receber notificações
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
  
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'PlanoCerto', body: event.data ? event.data.text() : 'Nova notificação' };
  }
  
  const title = data.title || 'PlanoCerto';
  const options = {
    body: data.body || 'Você tem uma nova notificação',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    image: data.image || null,
    vibrate: [200, 100, 200, 100, 200],
    tag: data.tag || 'default',
    requireInteraction: data.requireInteraction || false,
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now(),
      ...data.data
    },
    actions: data.actions || [
      { action: 'view', title: 'Ver', icon: '/icon-192.png' },
      { action: 'close', title: 'Fechar', icon: '/icon-192.png' }
    ],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification Click - Ação ao clicar na notificação
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Verificar se já existe uma janela aberta
        for (let client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Abrir nova janela se não existir
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background Sync - Sincronizar quando voltar online
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
  
  if (event.tag === 'sync-alerts') {
    event.waitUntil(syncAlerts());
  }
});

async function syncFavorites() {
  console.log('[SW] Syncing favorites...');
  // Implementar sincronização de favoritos
  return Promise.resolve();
}

async function syncAlerts() {
  console.log('[SW] Syncing alerts...');
  // Implementar sincronização de alertas
  return Promise.resolve();
}

// Periodic Background Sync - Verificar atualizações periodicamente
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync:', event.tag);
  
  if (event.tag === 'check-price-updates') {
    event.waitUntil(checkPriceUpdates());
  }
});

async function checkPriceUpdates() {
  console.log('[SW] Checking price updates...');
  // Implementar verificação de atualizações de preços
  return Promise.resolve();
}

// Message - Comunicação com a aplicação
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

console.log('[SW] Service Worker loaded');
