// Service Worker for اذكار ، Ankara - زاد المسلم
const CACHE_NAME = 'adhkar-ankara-pwa-v7';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/images/app_logo.jpg',
  '/images/islamic_minimal_icon.jpg',
  '/images/islamic_minimal_icon_1790783471439.jpg',
  '/assets/islamic_minimal_icon.jpg',
  '/images/quran_rehal.jpg',
  '/images/holy_kaaba.jpg',
  '/images/islamic_hero_banner.jpg',
  '/images/prayer_steps_banner.jpg',
  '/images/adhkar_banner.jpg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        STATIC_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn(`Could not pre-cache asset ${asset}:`, err);
          })
        )
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Cache strategies: Network-first for app shell, Stale-while-revalidate for Quran API & Fonts, Cache-first for images
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // 1. Intercept legacy or build-broken logo URLs (e.g., /src/assets/images/islamic_minimal_icon_1790783471439.jpg)
  if (url.pathname.includes('islamic_minimal_icon_1790783471439') || url.pathname.includes('/src/assets/images/')) {
    event.respondWith(
      caches.match('/images/app_logo.jpg').then((cached) => {
        if (cached) return cached;
        return fetch('/images/app_logo.jpg').catch(() => fetch(event.request));
      })
    );
    return;
  }

  // 2. Quran Cloud API & Fonts: Cache-First with Network Background Revalidation for offline support
  if (url.hostname.includes('alquran.cloud') || url.hostname.includes('fonts.gstatic.com') || url.hostname.includes('fonts.googleapis.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 3. Ignore other cross-origin audio / streams (e.g. everyayah mp3s) to prevent large storage bloat
  if (url.origin !== self.origin) {
    return;
  }

  // 4. Navigation requests (HTML documents): Network First with Cache Fallback to '/'
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      }).catch(() => {
        return caches.match('/').then(cached => cached || caches.match('/index.html'));
      })
    );
    return;
  }

  // 5. Scripts, Styles & other static code: Network First with Cache Fallback (never return HTML for scripts)
  if (event.request.destination === 'script' || event.request.destination === 'style') {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // 6. Static images and icons: Cache First with Network Fallback and Logo Recovery
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          return networkResponse;
        }
        // If image returns 404/non-200 and it's a logo or icon, fallback to default app logo
        if (url.pathname.includes('islamic_minimal_icon') || url.pathname.includes('app_logo')) {
          return caches.match('/images/app_logo.jpg').then(fb => fb || networkResponse);
        }
        return networkResponse;
      }).catch(() => {
        // Network offline or fetch failed - provide logo fallback
        if (url.pathname.includes('islamic_minimal_icon') || url.pathname.includes('app_logo')) {
          return caches.match('/images/app_logo.jpg');
        }
        return caches.match(event.request);
      });
    })
  );
});
