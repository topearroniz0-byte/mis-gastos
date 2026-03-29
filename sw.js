const CACHE_NAME = 'topebyte-v3'; // Versión actualizada
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './logo.png'
];

// Instalación: Guarda los archivos en la caché
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Fuerza a que el nuevo SW se active inmediatamente
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Cacheando archivos');
      return cache.addAll(ASSETS);
    })
  );
});

// Activación: Limpia versiones viejas de la caché
self.addEventListener('activate', (e) => {
  console.log('SW: Activado');
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Estrategia: Primero busca en caché, si no hay, busca en la red
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});