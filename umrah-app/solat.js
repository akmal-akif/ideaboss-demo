/* Kiraan waktu solat dalam apps (tanpa API luar).
   Malaysia: kaedah JAKIM (Subuh 20°, Isyak 18°, ihtiyati 2 minit). Saudi: Umm al-Qura (Subuh 18.5°, Isyak 90 minit). */
const SOL_NAMES = [['subuh','Subuh'],['syuruk','Syuruk'],['zohor','Zohor'],['asar','Asar'],['maghrib','Maghrib'],['isyak','Isyak']];
const PRESET = {
  kl: { n: 'Kuala Lumpur', lat: 3.139, lng: 101.687 },
  madinah: { n: 'Madinah', lat: 24.4672, lng: 39.6112 },
  makkah: { n: 'Makkah', lat: 21.4225, lng: 39.8262 }
};
const D2R = Math.PI / 180, R2D = 180 / Math.PI;
const sinD = d => Math.sin(d * D2R), cosD = d => Math.cos(d * D2R), tanD = d => Math.tan(d * D2R);
const fix = (a, b) => { a = a - b * Math.floor(a / b); return a < 0 ? a + b : a; };
function inSaudi(lat, lng) { return lat > 16 && lat < 32.5 && lng > 34 && lng < 56; }
function locTz(loc) {
  if (inSaudi(loc.lat, loc.lng)) return 3;
  if (loc.lat > 0.5 && loc.lat < 7.5 && loc.lng > 99 && loc.lng < 119.5) return 8;
  return -new Date().getTimezoneOffset() / 60;
}
function sun(jd) {
  const D = jd - 2451545.0, g = fix(357.529 + 0.98560028 * D, 360), q = fix(280.459 + 0.98564736 * D, 360);
  const L = fix(q + 1.915 * sinD(g) + 0.020 * sinD(2 * g), 360), e = 23.439 - 0.00000036 * D;
  const RA = Math.atan2(cosD(e) * sinD(L), cosD(L)) * R2D / 15;
  return { decl: Math.asin(sinD(e) * sinD(L)) * R2D, eqt: q / 15 - fix(RA, 24) };
}
function prayerTimes(loc, y, m, d) {
  const saudi = inSaudi(loc.lat, loc.lng);
  const jd = Date.UTC(y, m, d, 12) / 86400000 + 2440587.5 - loc.lng / 360;
  const s = sun(jd), lat = loc.lat;
  const noon = 12 - loc.lng / 15 - s.eqt;
  const T = ang => Math.acos((-sinD(ang) - sinD(s.decl) * sinD(lat)) / (cosD(s.decl) * cosD(lat))) * R2D / 15;
  const asrAng = -Math.atan(1 / (1 + tanD(Math.abs(lat - s.decl)))) * R2D;
  const fajrA = saudi ? 18.5 : 20, rise = 0.833;
  const h = { subuh: noon - T(fajrA), syuruk: noon - T(rise), zohor: noon + (saudi ? 0 : 2 / 60), asar: noon + T(asrAng), maghrib: noon + T(rise) };
  h.isyak = saudi ? h.maghrib + 1.5 : noon + T(18);
  if (!saudi) { h.subuh += 2 / 60; h.asar += 2 / 60; h.maghrib += 2 / 60; h.isyak += 2 / 60; h.syuruk -= 2 / 60; }
  const base = Date.UTC(y, m, d), out = {};
  for (const [k] of SOL_NAMES) out[k] = new Date(base + Math.round(h[k] * 60) * 60000);
  return out;
}
function locDay(loc, offsetDays = 0) {
  const t = new Date(Date.now() + locTz(loc) * 3600000 + offsetDays * 86400000);
  return [t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()];
}
function fmtWaktu(dt, loc) {
  const t = new Date(dt.getTime() + locTz(loc) * 3600000);
  const hh = t.getUTCHours(), mm = String(t.getUTCMinutes()).padStart(2, '0');
  const ap = hh < 12 ? 'pagi' : (hh < 14 ? 'tengah hari' : (hh < 19 ? 'petang' : 'malam'));
  return `${hh % 12 || 12}:${mm} ${ap}`;
}
function nextPrayer(loc) {
  const now = Date.now();
  for (const off of [0, 1]) {
    const t = prayerTimes(loc, ...locDay(loc, off));
    for (const [k, n] of SOL_NAMES) { if (k === 'syuruk') continue; if (t[k].getTime() > now) return { k, n, at: t[k] }; }
  }
  return null;
}
function lagiMasa(ms) { const m = Math.max(0, Math.round(ms / 60000)), h = Math.floor(m / 60); return h ? `${h} jam ${m % 60} min` : `${m} min`; }
