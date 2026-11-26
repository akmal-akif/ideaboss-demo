const object = (value) => value && typeof value === 'object' && !Array.isArray(value);
const validPath = (value) => typeof value === 'string' && /^[\w-]+(?:\.[\w-]+)*$/.test(value);
const field = (record, path) => path ? path.split('.').reduce((value, key) => value != null && Object.hasOwn(value, key) ? value[key] : undefined, record) : record;

function amount(value, unit) {
  if (value == null || value === '') return null;
  const text = String(value);
  if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(text)) throw new Error('Invalid price');
  const [whole, fraction = ''] = text.split('.');
  if (unit === 'sen' && fraction) throw new Error('Price in sen must be an integer');
  return unit === 'sen' ? Number(whole) : Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}

function localDate(value, format) {
  if (typeof value !== 'string') return value;
  if (format === 'DD/MM/YYYY') {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
    return match ? `${match[3]}-${match[2]}-${match[1]}` : null;
  }
  return value;
}

export function travelDeskLoader({ url, key, config, request = fetch }) {
  const upstream = new URL(url);
  const { method = 'GET', auth, fields, query = {}, body = {}, publishedIds, publication } = config;
  const { rows, id, packageName, departureDate, price, hotels, hotelName, priceUnit = 'MYR', dateFormat = 'YYYY-MM-DD' } = fields || {};
  if (upstream.protocol !== 'https:' || upstream.username || upstream.password || upstream.hash || !key || !['GET', 'POST'].includes(method)
    || !['header', 'query', 'body'].includes(auth?.in) || !/^[\w-]+$/.test(auth.name || '') || (auth.prefix != null && typeof auth.prefix !== 'string')
    || (auth.in === 'body' && method !== 'POST') || !object(query) || !object(body)
    || ![id, packageName, departureDate].every(validPath) || ![rows, price, hotels, hotelName].every((path) => path == null || validPath(path))
    || !['MYR', 'sen'].includes(priceUnit) || !['YYYY-MM-DD', 'DD/MM/YYYY'].includes(dateFormat)
    || ((publishedIds == null) === (publication == null))
    || (publishedIds != null && (!Array.isArray(publishedIds) || !publishedIds.every((value) => typeof value === 'string')))
    || (publication != null && (!validPath(publication.field) || !['boolean', 'string', 'number'].includes(typeof publication.value)))) {
    throw new Error('Check the TravelDesk URL, authentication, field mapping and publication settings.');
  }
  const approved = new Set(publishedIds);
  const secret = `${auth.prefix ?? ''}${key}`;

  return async () => {
    const target = new URL(upstream);
    for (const [name, value] of Object.entries(query)) target.searchParams.set(name, String(value));
    const headers = new Headers({ Accept: 'application/json' });
    let payload = body;
    if (auth.in === 'header') headers.set(auth.name, secret);
    if (auth.in === 'query') target.searchParams.set(auth.name, secret);
    if (auth.in === 'body') payload = { ...payload, [auth.name]: secret };
    if (method === 'POST') headers.set('Content-Type', 'application/json');
    const response = await request(target, { method, headers, body: method === 'POST' ? JSON.stringify(payload) : undefined,
      redirect: 'error', signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('TravelDesk request failed');
    const items = field(await response.json(), rows);
    if (!Array.isArray(items)) throw new Error('TravelDesk did not return a departure list');
    return items.filter((record) => publication ? field(record, publication.field) === publication.value : approved.has(String(field(record, id))))
      .map((record) => {
        const ref = field(record, id);
        const lodging = hotels ? field(record, hotels) : null;
        const safeRef = typeof ref === 'number' && Number.isSafeInteger(ref) ? String(ref) : ref;
        return { id: safeRef, packageName: field(record, packageName), departureDate: localDate(field(record, departureDate), dateFormat),
          priceMyrSen: amount(price ? field(record, price) : null, priceUnit), hotels: lodging == null || lodging === '' ? []
            : (Array.isArray(lodging) ? lodging : [lodging]).map((hotel) => field(hotel, hotelName)), published: true };
      });
  };
}
