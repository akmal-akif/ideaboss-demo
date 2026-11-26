import { test } from 'node:test';
import assert from 'node:assert/strict';
import { departuresServer } from './departures.mjs';

const current = { id: 'sample', packageName: 'Pakej ujian', departureDate: '2026-11-27', priceMyrSen: null, hotels: [], published: true, privateNote: 'internal' };

test('lists only reviewed upcoming departures in Malaysia and exposes only public fields', async (t) => {
  let rows = [current, { ...current, id: 'past', departureDate: '2026-11-26' }, { ...current, id: 'draft', published: false }];
  const server = departuresServer({ load: () => rows, clock: () => new Date('2026-11-26T16:30:00Z') });
  await new Promise(done => server.listen(0, '127.0.0.1', done));
  t.after(() => new Promise(done => server.close(done)));
  const url = `http://127.0.0.1:${server.address().port}/api/departures`;
  const response = await fetch(url);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await response.json(), { departures: [{ id: 'sample', packageName: 'Pakej ujian', departureDate: '2026-11-27', priceMyrSen: null, hotels: [] }] });
  assert.equal((await fetch(url, { method: 'POST' })).status, 405);
  rows = [{ ...current, departureDate: '2026-02-30' }];
  assert.equal((await fetch(url)).status, 503);
  rows = [];
  assert.deepEqual(await (await fetch(url)).json(), { departures: [] });
});
