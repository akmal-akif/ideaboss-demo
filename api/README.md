# API jadual berlepas App Juara

Guna Node.js 22 atau lebih baharu. Dari akar repo, jalankan `node --test api/*.test.mjs`.

## Cuba dengan data ujian

Jalankan `JUARA_DEPARTURES_FILE=/path/to/departures.json node api/departures.mjs`. Fail mengandungi senarai objek dengan `id`, `packageName`, `departureDate` (`YYYY-MM-DD`), `priceMyrSen` (integer sen MYR atau `null`), `hotels` (senarai nama atau `[]`) dan `published` (boolean). API mendengar pada `127.0.0.1:3000` dan menyediakan `GET /api/departures`.

## Sambung TravelDesk

1. Salin `api/traveldesk.example.json` ke fail konfigurasi di luar repo. Contoh ini hanya menunjukkan format konfigurasi, termasuk POST `multipart/form-data`, header `AUTHKEY`, serta `selectedYear` dan `selectedMonth`. Ubah tahun dan bulan untuk tempoh yang hendak dipaparkan. Nama medan respons dalam fail itu ialah contoh. Isi mengikut dokumen TravelDesk sebenar. `fields.rows` boleh ditinggalkan jika respons terus berupa senarai. Gunakan `priceUnit` bernilai `MYR` atau `sen`, dan `dateFormat` bernilai `YYYY-MM-DD` atau `DD/MM/YYYY`. `fields.hotelName` hanya diperlukan jika hotel dihantar sebagai objek. Untuk auth dalam header, query atau badan JSON, gunakan `auth.in` bernilai `header`, `query` atau `body` mengikut dokumen.
2. Senaraikan ID pelepasan yang Juara benarkan untuk paparan awam dalam `publishedIds`. Jika TravelDesk menyediakan medan kelulusan yang sesuai, gunakan `publication` dengan `field` dan nilai `value` yang perlu dipadankan secara tepat. Pilih satu kaedah. Senarai ID kosong memaparkan halaman kosong dengan mesej status.
3. Pada hos yang menjalankan Node.js, isi `TRAVELDESK_URL` dengan URL HTTPS yang sebenar, `TRAVELDESK_AUTHKEY` sebagai rahsia server dan `JUARA_TRAVELDESK_CONFIG` dengan laluan fail konfigurasi. Jalankan `node api/departures.mjs`. Gunakan `HOST` dan `PORT` jika diperlukan oleh hos. Buang `JUARA_DEPARTURES_FILE` daripada konfigurasi server TravelDesk supaya sumber ujian tidak diutamakan.
4. Letak URL awam App Juara API (akhiri dengan `/api/departures`) dalam `JT.departuresApiUrl` di `umrah-app/juara-tetapan.js`. Jika app di GitHub Pages, tetapkan `JUARA_APP_ORIGIN=https://akmal-akif.github.io` pada server API. Jika app menggunakan domain lain, guna origin sebenar tanpa laluan. GitHub Pages menghos fail app. Jalankan API di hos Node yang berasingan atau lalukan `/api/departures` melalui hos yang sama.

Simpan `TRAVELDESK_AUTHKEY` dalam tetapan rahsia hos. Jika TravelDesk mensyaratkan cookie, masukkan **nilai** `laravel_session` sahaja ke rahsia `TRAVELDESK_SESSION`. Server membentuk header `Cookie` dan sempadan multipart secara automatik. Gunakan sesi yang diluluskan oleh TravelDesk. Cookie sesi boleh tamat dan perlu diganti jika tiada kelayakan integrasi kekal. Semak satu pelepasan yang diluluskan dan cuba keadaan sambungan terputus sebelum mengaktifkan pautan untuk pengguna. Jualan dan Pakej menggunakan jadual baca sahaja apabila URL diisi. Tempahan memerlukan sambungan berasingan.
