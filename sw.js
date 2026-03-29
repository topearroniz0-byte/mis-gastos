const CACHE_NAME = 'topebyte-v4'; // Subimos a v4
const ASSETS = [
  '/mis-gastos/',
  '/mis-gastos/index.html',
  '/mis-gastos/style.css',
  '/mis-gastos/script.js',
  '/mis-gastos/manifest.json',
  '/mis-gastos/logo.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});