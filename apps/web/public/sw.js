// Service Worker for dshit.xyz PWA
// Provides offline support and caching strategies

const CACHE_VERSION = 'v1';
const CACHE_NAMES = {
  static: `dshit-static-${CACHE_VERSION}`,
  dynamic: `dshit-dynamic-${CACHE_VERSION}`,
  api: `dshit-api-${CACHE_VERSION}`,
};

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/globals.css',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAMES.static).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.log('Cache addAll error:', err);
        // Non-fatal: continue even if some assets fail to cache
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            !Object.values(CACHE_NAMES).includes(cacheName) &&
            cacheName.startsWith('dshit-')
          ) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests - Network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response.ok) {
            return response;
          }
          // Clone and cache successful API responses
          const clonedResponse = response.clone();
          caches.open(CACHE_NAMES.api).then((cache) => {
            cache.put(request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cached API response
          return caches
            .match(request)
            .then((cachedResponse) => {
              return (
                cachedResponse ||
                new Response(
                  JSON.stringify({
                    error: 'Offline',
                    message: 'You are offline. Please try again when connected.',
                  }),
                  {
                    status: 503,
                    headers: { 'Content-Type': 'application/json' },
                  }
                )
              );
            });
        })
    );
    return;
  }

  // Static/HTML pages - Cache first, fallback to network
  if (
    request.mode === 'navigate' ||
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style'
  ) {
    event.respondWith(
      caches
        .match(request)
        .then((cachedResponse) => {
          return (
            cachedResponse ||
            fetch(request).then((response) => {
              if (!response.ok) {
                return response;
              }
              // Cache successful responses
              const clonedResponse = response.clone();
              caches.open(CACHE_NAMES.dynamic).then((cache) => {
                cache.put(request, clonedResponse);
              });
              return response;
            })
          );
        })
        .catch(() => {
          // Fallback to offline page if available
          return caches.match('/offline.html') ||
            new Response(
              `<!DOCTYPE html>
<html>
<head><title>Offline</title></head>
<body>
<h1>You are offline</h1>
<p>dshit.xyz requires an internet connection.</p>
<p>Please check your connection and try again.</p>
</body>
</html>`,
              {
                status: 503,
                headers: { 'Content-Type': 'text/html' },
              }
            );
        })
    );
    return;
  }

  // Images and media - Stale while revalidate
  if (request.destination === 'image' || request.destination === 'media') {
    event.respondWith(
      caches.open(CACHE_NAMES.dynamic).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((response) => {
            if (response.ok) {
              const clonedResponse = response.clone();
              cache.put(request, clonedResponse);
            }
            return response;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Default - Network first
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response.ok) {
          return response;
        }
        const clonedResponse = response.clone();
        caches.open(CACHE_NAMES.dynamic).then((cache) => {
          cache.put(request, clonedResponse);
        });
        return response;
      })
      .catch(() => {
        return caches
          .match(request)
          .then((cachedResponse) => {
            return (
              cachedResponse ||
              new Response('Network request failed and no cache available', {
                status: 503,
              })
            );
          });
      })
  );
});

// Background sync for failed API calls (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orders') {
    event.waitUntil(
      // Sync failed orders when back online
      Promise.resolve()
    );
  }
});

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'dshit.xyz';
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    ...data.options,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Focus existing window if open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window if not open
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
