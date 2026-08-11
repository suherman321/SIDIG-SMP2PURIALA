const CACHE_NAME = 'pwa-nilai-v33'; // Naikkan versi cache ke v29

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',      // <--- Ditambahkan
  './app.js',
  './manifest.json',
  './logo.png',
  './bg-sekolah.jpg',
  './card.png'        // <--- Pastikan sesuai dengan nama file gambar Anda
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
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(e.request);
      })
  );
});