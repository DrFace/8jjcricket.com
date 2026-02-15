// public/sw.js
const CACHE_NAME = '8jj-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/site.webmanifest',
  '/favicon.ico',
  '/8jjlogo.png',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // 1. Skip non-GET or chrome-extension/data etc.
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 2. Return from cache if found
      if (cachedResponse) return cachedResponse;

      // 3. Otherwise try network
      return fetch(event.request)
        .then((response) => {
          // If not dynamic contents, just return
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 4. Cache static assets for future offline use
          const url = event.request.url;
          if (
            url.includes('.png') ||
            url.includes('.jpg') ||
            url.includes('.svg') ||
            url.includes('_next/static') ||
            url.includes('/fonts/')
          ) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }

          return response;
        })
        .catch((err) => {
          console.warn('[SW] Fetch failed:', err);

          // 5. Fallback for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          
          // 6. Return a generic error response instead of undefined to avoid browser crash
          return new Response('Network error occurred', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' },
          });
        });
    })
  );
});
