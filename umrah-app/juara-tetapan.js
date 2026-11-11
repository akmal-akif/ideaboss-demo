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

  // Mata ganjaran untuk jemaah dan bakal jemaah
  mata: {
    daftarApps: 100,       // sekali, bila daftar dalam apps
    tempahanDeposit: 200,  // setiap tempahan dengan bayaran deposit
    bayaranPenuh: 500,     // setiap tempahan yang dibayar penuh
    rujukKawan: 300        // bila kawan tempah guna kod rujukan anda
  },

  // Tahap ahli ikut jumlah mata terkumpul
  tahap: [
    { n: 'Perak', min: 0 },
    { n: 'Emas', min: 3000 },
    { n: 'Platinum', min: 8000 }
  ],

  // Maklumat kempen
  kempen: {
    nama: 'Mata Ganjaran Jemaah Juara',
    mula: '2026-12-01',
    tamat: '2027-03-31',
    luputBulan: 12,
    hariHantarBaucar: 7
  },

  // Kod rujukan pengguna dalam demo
  kodSaya: 'AMINAH88'
};
