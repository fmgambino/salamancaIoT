const CACHE_NAME = 'medtuciot-modern-v1';
const ASSETS = [
  './', './index.html', './manifest.json', './favicon.svg',
  './assets/css/globals.css', './assets/css/theme.css', './assets/css/layout.css', './assets/css/components.css', './assets/css/forms.css', './assets/css/tables.css', './assets/css/responsive.css',
  './assets/js/app.js'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : Promise.resolve()))));
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
