import { readFile } from 'node:fs/promises';
import { departuresServer } from './departures.mjs';

const app = new URL('../umrah-app/', import.meta.url);
const types = { html: 'text/html; charset=utf-8', js: 'text/javascript; charset=utf-8', css: 'text/css; charset=utf-8',
  json: 'application/json', png: 'image/png', jpg: 'image/jpeg', svg: 'image/svg+xml' };

async function servePage(req, res) {
  const path = req.url.split('?')[0];
  if (req.method !== 'GET') { res.writeHead(405, { Allow: 'GET' }).end(); return; }
  if (path === '/') { res.writeHead(302, { Location: '/index.html#berlepas' }).end(); return; }
  const asset = /^\/(?:img\/)?[a-z0-9-]+\.(html|js|css|json|png|jpg|svg)$/.exec(path);
  if (!asset) { res.writeHead(404).end(); return; }
  try {
    const data = await readFile(new URL(path.slice(1), app));
    res.writeHead(200, { 'Content-Type': types[asset[1]], 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }).end(data);
  } catch {
    res.writeHead(404).end();
  }
}

const dateIn = (days) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
const departures = [
  { id: 'demo-1', packageName: 'Pakej Umrah Ujian', departureDate: dateIn(45), priceMyrSen: 500000, hotels: ['Hotel Ujian'], published: true },
  { id: 'demo-2', packageName: 'Pakej Umrah Ujian Kedua', departureDate: dateIn(60), priceMyrSen: null, hotels: [], published: true },
];
const server = departuresServer({ load: () => departures, servePage });
server.listen(Number(process.env.PORT || 3000), '127.0.0.1', () => {
  console.log(`Demo App Juara dengan data contoh: http://127.0.0.1:${server.address().port}/`);
});
