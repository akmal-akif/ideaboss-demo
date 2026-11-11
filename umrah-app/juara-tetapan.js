/* =========================================================
   Tetapan tab Juara dan kempen mata ganjaran agent.
   Tukar nilai di sini sahaja. Semua nilai di bawah ialah CONTOH.
   ========================================================= */
const JT = {
  // Nombor WhatsApp Juara untuk terima tempahan (contoh, ganti dengan nombor sebenar)
  waJuara: '60120000000',

  // Deposit untuk setiap jemaah (RM)
  depositSeorang: 1000,

  // Baki penuh perlu dijelaskan berapa hari sebelum berlepas
  bakiSebelumHari: 45,

  // Mata ganjaran agent
  mata: {
    daftarJemaah: 50,      // setiap jemaah baru yang daftar guna kod agent
    tempahanDeposit: 200,  // bila jemaah bayar deposit
    bayaranPenuh: 500,     // bila jemaah bayar penuh
    rujukanBerulang: 100   // jemaah lama tempah semula guna kod agent
  },

  // Tahap agent ikut jumlah mata terkumpul
  tahap: [
    { n: 'Perak', min: 0 },
    { n: 'Emas', min: 3000 },
    { n: 'Platinum', min: 8000 }
  ],

  // Maklumat kempen
  kempen: {
    nama: 'Kempen Mata Ganjaran Agent Juara',
    mula: '2026-12-01',
    tamat: '2027-03-31',
    luputBulan: 12,
    hariHantarBaucar: 7
  },

  // Agent yang dipaparkan dalam skrin Ganjaran Agent (demo)
  agentDemo: 'SALMAH01'
};
