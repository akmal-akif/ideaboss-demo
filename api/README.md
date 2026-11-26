# Jadual berlepas App Juara

Jalankan `node --test api/departures.test.mjs` dari akar repo untuk menguji API. Untuk preview tempatan, sediakan fail JSON di luar repo dan jalankan `JUARA_DEPARTURES_FILE=/path/to/departures.json node api/departures.mjs`. API mendengar di `127.0.0.1:3000` dan menyediakan `GET /api/departures`.

Fail preview mengandungi senarai objek dengan `id`, `packageName`, `departureDate` (`YYYY-MM-DD`), `priceMyrSen` (integer sen MYR atau `null`), `hotels` (senarai nama atau `[]`) dan `published` (boolean). API memaparkan hanya jadual yang ditanda untuk paparan awam dan masih akan datang, ikut hari Malaysia. Respons mengehadkan medan kepada lima butiran pakej dan tarikh, tanpa medan dalaman.

Ini format App Juara sendiri. Untuk sambungan sebenar, padankan respons `departureList` daripada dokumentasi TravelDesk pada pelayan dan tapis kepada pakej yang Juara setuju paparkan. Simpan akses TravelDesk di pelayan. GitHub Pages hanya menghos fail app, jadi API perlu hos yang boleh menjalankan pelayan Node. Sambungan katalog app, ujian dengan data TravelDesk dan keputusan deploy menyusul selepas kontrak TravelDesk disahkan.
