import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { travelDeskLoader } from './traveldesk.mjs';

function date(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(+parsed) && parsed.toISOString().slice(0, 10) === value;
}

const label = (value) => typeof value === 'string' && value.trim() && value.length <= 160;

export function publicDepartures(rows, today) {
  if (!Array.isArray(rows)) throw new Error('Expected a list of departures');
  const ids = new Set();
  return rows.filter((row) => row?.published === true).map((row) => {
    const { id, packageName, departureDate, priceMyrSen, hotels } = row;
    if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(id) || ids.has(id) || !label(packageName) || !date(departureDate)
      || !(priceMyrSen === null || (Number.isSafeInteger(priceMyrSen) && priceMyrSen >= 0))
      || !Array.isArray(hotels) || !hotels.every(label)) throw new Error('Invalid published departure');
    ids.add(id);
    return { id, packageName: packageName.trim(), departureDate, priceMyrSen, hotels: hotels.map((name) => name.trim()) };
  }).filter((row) => row.departureDate >= today).sort((a, b) => a.departureDate.localeCompare(b.departureDate));
}

function malaysiaDate(clock) {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Kuala_Lumpur', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(clock());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function departuresServer({ load, origin, clock = () => new Date() }) {
  return createServer(async (req, res) => {
    const cors = origin && req.headers.origin === origin ? { 'Access-Control-Allow-Origin': origin } : {};
    const send = (status, data, extra = {}) => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', Vary: 'Origin', ...cors, ...extra });
      res.end(JSON.stringify(data));
    };
    if (req.url?.split('?')[0] !== '/api/departures') return send(404, { error: 'Laluan tidak dijumpai.' });
    if (req.method !== 'GET') return send(405, { error: 'Gunakan GET.' }, { Allow: 'GET' });
    try {
      const rows = await load();
      return send(200, { departures: publicDepartures(rows, malaysiaDate(clock)) });
    } catch {
      return send(503, { error: 'Jadual berlepas belum dapat dimuatkan.' });
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { JUARA_DEPARTURES_FILE: preview, JUARA_TRAVELDESK_CONFIG: path, TRAVELDESK_URL: url,
    TRAVELDESK_AUTHKEY: key, TRAVELDESK_SESSION: session, JUARA_APP_ORIGIN: origin, HOST = '127.0.0.1', PORT = '3000' } = process.env;
  if (!preview && !(path && url && key)) throw new Error('Set JUARA_DEPARTURES_FILE for preview or configure TravelDesk.');
  const load = preview ? async () => JSON.parse(await readFile(preview, 'utf8'))
    : travelDeskLoader({ url, key, session, config: JSON.parse(await readFile(path, 'utf8')) });
  departuresServer({ load, origin }).listen(Number(PORT), HOST, () => console.log('Juara departures API is listening.'));
}
