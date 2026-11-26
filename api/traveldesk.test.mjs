import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { travelDeskLoader } from './traveldesk.mjs';
import { departuresServer } from './departures.mjs';

const page = readFileSync(new URL('../umrah-app/index.html', import.meta.url), 'utf8');
const escape = page.split('\n').find((line) => line.startsWith('const esc = '));
const app = readFileSync(new URL('../umrah-app/departures.js', import.meta.url), 'utf8');
const departureCardsForTest = runInNewContext(`${escape}\n${app}\ndepartureCards`);

const config = {
  method: 'POST', auth: { in: 'body', name: 'AUTHKEY' }, body: { operation: 'departureList' },
  fields: { rows: 'data.items', id: 'ref', packageName: 'product.name', departureDate: 'starts',
    price: 'price', hotels: 'rooms', hotelName: 'name', priceUnit: 'MYR', dateFormat: 'DD/MM/YYYY' },
  publication: { field: 'approval', value: 'public' },
};
const item = { ref: 'j1', product: { name: 'Umrah & <Juara>' }, starts: '27/11/2026', price: '8799.10',
  rooms: [{ name: 'Hotel <Demo>' }], approval: 'public', passport: 'not public' };

test('loads and maps the TravelDesk response through the public endpoint and presents the same values in the app', async (t) => {
  let fail = false;
  const url = 'https://traveldesk.example/partner-api';
  const load = travelDeskLoader({ url, key: 'example-key', config, request: async (target, options) => {
    assert.equal(String(target), url);
    assert.equal(options.redirect, 'error');
    assert.equal(options.method, 'POST');
    assert.deepEqual(JSON.parse(options.body), { operation: 'departureList', AUTHKEY: 'example-key' });
    if (fail) return new Response('{"internal":"example-key"}', { status: 401 });
    return Response.json({ data: { items: [item, { ...item, ref: 'draft', approval: 'internal' }] } });
  } });
  const origin = 'https://juara.example';
  const server = departuresServer({ load, origin, clock: () => new Date('2026-11-26T16:30:00Z') });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const endpoint = `http://127.0.0.1:${server.address().port}/api/departures`;
  const r = await fetch(endpoint, { headers: { Origin: origin } });
  assert.equal(r.headers.get('access-control-allow-origin'), origin);
  assert.equal((await fetch(endpoint, { headers: { Origin: 'https://other.example' } })).headers.get('access-control-allow-origin'), null);
  const rows = (await r.json()).departures;
  assert.deepEqual(rows, [{ id: 'j1', packageName: item.product.name, departureDate: '2026-11-27', priceMyrSen: 879910, hotels: ['Hotel <Demo>'] }]);
  const html = departureCardsForTest(rows);
  assert.match(html, /Umrah &amp; &lt;Juara&gt;/);
  assert.match(html, /27 November 2026/);
  assert.match(html, /Hotel &lt;Demo&gt;/);
  assert.match(departureCardsForTest([{ ...rows[0], priceMyrSen: null, hotels: [] }]), /Belum disahkan/);
  assert.match(departureCardsForTest([]), /Tiada jadual/);
  fail = true;
  const failed = await fetch(endpoint);
  assert.equal(failed.status, 503);
  assert.doesNotMatch(await failed.text(), /example-key|internal/);
});

test('requires explicit publication rules and limits the feed to the approved IDs', async () => {
  const base = { url: 'https://traveldesk.example/partner-api', key: 'example-key' };
  assert.throws(() => travelDeskLoader({ ...base, config: { ...config, publication: undefined } }), /publication/);
  const load = travelDeskLoader({ ...base, config: { ...config, publication: undefined, publishedIds: ['j1'] },
    request: async () => Response.json({ data: { items: [item, { ...item, ref: 'j2' }] } }) });
  assert.deepEqual((await load()).map((row) => row.id), ['j1']);
});

test('sends the TravelDesk month filter in multipart form with server-side authentication', async () => {
  const multipart = { ...config, encoding: 'multipart', auth: { in: 'header', name: 'AUTHKEY' },
    body: { selectedYear: '2026', selectedMonth: '11' } };
  const base = { url: 'https://traveldesk.example/partner-api', key: 'test-authkey', config: multipart };
  const load = travelDeskLoader({ ...base, session: 'test-session', request: async (url, options) => {
    const request = new Request(url, options);
    assert.equal(request.method, 'POST');
    assert.match(request.headers.get('content-type'), /^multipart\/form-data; boundary=.+$/);
    assert.equal(request.headers.get('AUTHKEY'), 'test-authkey');
    assert.equal(request.headers.get('Cookie'), 'laravel_session=test-session');
    assert.deepEqual(Object.fromEntries(await request.formData()), { selectedYear: '2026', selectedMonth: '11' });
    return Response.json({ data: { items: [item] } });
  } });
  assert.equal((await load())[0].id, item.ref);
  assert.throws(() => travelDeskLoader({ ...base, session: 'bad; another=1' }), /authentication/);
});
