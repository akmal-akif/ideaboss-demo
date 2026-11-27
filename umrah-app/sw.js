// Service worker apps Juara Travel: rangkaian dahulu, simpanan bila tiada internet.
// Data dari /api (pakej, seat, jemaah) tidak disimpan oleh service worker.
const C = 'juara-travel-v5';
const FILES = ['./', './index.html', './app.css', './app.js', './solat.js', './kredit.js', './juara-tetapan.js', './pakej-sebenar.js', './manifest.json', './logo-juara.png', './icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin === location.origin && u.pathname.startsWith('/api/')) return;
  e.respondWith(fetch(e.request).then(r => {
    if (r && r.ok && (r.type === 'basic' || r.type === 'cors')) { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); }
    return r;
  }).catch(() => caches.match(e.request).then(hit => hit || caches.match('./index.html'))));
});
