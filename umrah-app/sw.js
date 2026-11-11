const C = 'jemaah-juara-v4';
const FILES = ['./', './index.html', './manifest.json', './juara.css', './juara-tetapan.js', './juara-data.js', './juara.js', './logo-juara.png', './icon-192.png', './img/makkah-kumpulan.jpg', './img/nabawi-kumpulan.jpg', './img/doa.jpg', './img/madinah-bas.jpg', './img/petugas.jpg', './img/nabawi.jpg', './img/kaabah.jpg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => {
    const net = fetch(e.request).then(r => { if (r && r.ok && (r.type === 'basic' || r.type === 'cors')) { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); } return r; }).catch(() => hit);
    return hit || net;
  }));
});
