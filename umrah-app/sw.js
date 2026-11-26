const C = 'jemaah-juara-v13';
const FILES = ['./', './index.html', './manifest.json', './juara.css', './juara-tetapan.js', './juara-data.js', './pakej-sebenar.js', './kursus-data.js', './juara.js', './tentatif.js', './juara-api.js', './logo-juara.png', './icon-192.png', './img/makkah-kumpulan.jpg', './img/nabawi-kumpulan.jpg', './img/doa.jpg', './img/madinah-bas.jpg', './img/petugas.jpg', './img/nabawi.jpg', './img/kaabah.jpg', './img/tng.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Data jemaah dan seat sentiasa terus dari server, tidak disimpan dalam phone
  const pth = new URL(e.request.url).pathname;
  if (/\/(jemaah|seat|pakej)$/.test(pth)) return;
  e.respondWith(caches.match(e.request).then(hit => {
    const net = fetch(e.request).then(r => { if (r && r.ok && (r.type === 'basic' || r.type === 'cors')) { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); } return r; }).catch(() => hit);
    return hit || net;
  }));
});
