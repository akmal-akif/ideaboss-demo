function vDepartures() {
  return bar('utama', 'Utama') + `<main class="stack">
    <h1 class="h1">Jadual berlepas</h1>
    <div id="departures" class="stack" aria-live="polite"></div>
  </main>`;
}

const departureMoney = new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' });
const departureDay = new Intl.DateTimeFormat('ms-MY', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kuala_Lumpur' });

function departureCards(rows) {
  if (!Array.isArray(rows)) throw new Error('Jadual tidak sah');
  if (!rows.length) return '<div class="card">Tiada jadual berlepas yang disahkan buat masa ini.</div>';
  return rows.map((row) => {
    const day = departureDay.format(new Date(`${row.departureDate}T00:00:00Z`));
    const price = row.priceMyrSen == null ? 'Belum disahkan' : departureMoney.format(row.priceMyrSen / 100);
    const hotels = row.hotels.length ? row.hotels.map(esc).join(', ') : 'Belum disahkan';
    return `<article class="card stack"><h2 class="h2">${esc(row.packageName)}</h2>
      <div class="kv"><span>Berlepas</span><b>${esc(day)}</b></div>
      <div class="kv"><span>Harga</span><b>${esc(price)}</b></div>
      <div class="kv"><span>Hotel</span><b>${hotels}</b></div></article>`;
  }).join('');
}

async function mountDepartures() {
  const panel = document.getElementById('departures');
  if (!panel) return;
  panel.innerHTML = '<p class="muted">Memuatkan jadual berlepas…</p>';
  panel.setAttribute('aria-busy', 'true');
  try {
    const result = await fetch(JT.departuresApiUrl || '/api/departures', {
      cache: 'no-store', credentials: 'omit', signal: AbortSignal.timeout(12000),
    });
    if (!result.ok) throw new Error('Jadual tidak tersedia');
    const { departures } = await result.json();
    if (panel.isConnected) panel.innerHTML = departureCards(departures);
  } catch {
    if (!panel.isConnected) return;
    panel.innerHTML = '<div class="card stack"><p>Jadual berlepas tak dapat dimuatkan sekarang.</p><button class="btn sec" type="button">Cuba lagi</button></div>';
    panel.querySelector('button').addEventListener('click', mountDepartures, { once: true });
  } finally {
    panel.removeAttribute('aria-busy');
  }
}
