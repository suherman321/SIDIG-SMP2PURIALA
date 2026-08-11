const CACHE_NAME = 'sidig-v38'; // Naikkan versi cache ke v29

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',      // <--- Ditambahkan
  './app.js',
  './manifest.json',
  './logo.png',
  './bg-sekolah.jpg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Abaikan jika bukan request GET
  if (e.request.method !== 'GET') {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        // Izinkan request type 'basic' DAN 'cors' agar link eksternal seperti Google Drive bisa lewat
        if (networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Hindari men-cache extension Chrome yang bikin error kemarin
            if (!e.request.url.startsWith('chrome-extension')) {
              cache.put(e.request, responseClone);
            }
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(e.request);
      })
  );
});
  );
});