/* =========================================================
   Jadual kursus umrah dan haji Juara Travel.
   Sumber: https://www.juaratravel.com.my/perkhidmatan/kursus-umrah-haji
   Diambil pada 11 Nov 2026. Kursus yang sudah lepas disorok automatik.
   lat dan lng ialah ANGGARAN ikut bandar (bukan lokasi tepat), untuk kira jarak sahaja.
   Peta dan Waze cari ikut nama lokasi penuh.
   ========================================================= */
const KJ_SUMBER = 'https://www.juaratravel.com.my/perkhidmatan/kursus-umrah-haji';
const KJ_TARIKH = '2026-11-11';
const KJ = [
  {"n": "Kelantan", "t": "2026-11-14", "m": "08:00", "p": "Hj Mohd Zahrin Bin Salleh", "tel": ["0133860376"], "l": "Masjid As Solihin, Mukim Bechah Semak, Bunut Susu", "k": "Bunut Susu, Pasir Mas", "lat": 6.02, "lng": 102.12},
  {"n": "Kedah", "t": "2026-11-14", "m": "08:30", "p": "Cikgu Mohd Yusoff Bin Walat", "tel": ["0194809921"], "l": "Serambi Ilmu, 265 Jalan Seri Jenaris 5, Taman Seri Jenaris, Tikam Batu, Sg Petani, Kedah", "k": "Tikam Batu, Sungai Petani", "lat": 5.6, "lng": 100.44},
  {"n": "Pahang", "t": "2026-11-14", "m": "08:30", "p": "Ustaz Noor Azlan Bin Mohammad", "tel": ["0132273407"], "l": "Masjid As Syakirin Kampung Rantau Panjang 28500 Lanchang Pahang", "k": "Lanchang", "lat": 3.48, "lng": 102.2},
  {"n": "Pahang", "t": "2026-11-14", "m": "08:30", "p": "Hjh Lailah", "tel": ["0179221841"], "l": "Masjid Jamek Kg Durian Sebatang Dong Raub", "k": "Dong, Raub", "lat": 3.85, "lng": 101.97},
  {"n": "Johor", "t": "2026-11-14", "m": "09:00", "p": "Ustaz Hasanin Bin Tamio", "tel": ["0127838192", "0137009900", "0197515323"], "l": "Pejabat Juara Travel Cawangan Parit Sulong", "k": "Parit Sulong, Batu Pahat", "lat": 1.98, "lng": 102.88},
  {"n": "Pahang", "t": "2026-11-14", "m": "09:00", "p": "Haji Azizi", "tel": ["0199131562"], "l": "Surau Taman Maran Impian,maran, Pahang", "k": "Maran", "lat": 3.59, "lng": 102.77},
  {"n": "Pahang", "t": "2026-11-14", "m": "09:00", "p": "Ustaz Muhammad Haffiz Bin Ramli", "tel": ["0107844243"], "l": "Masjid Jamek, Bandar Triang", "k": "Triang", "lat": 3.25, "lng": 102.42},
  {"n": "Selangor", "t": "2026-11-14", "m": "09:00", "p": "Ustaz Wan Marzuki", "tel": ["0192600430"], "l": "Surau Al-muqarabbin, Alam Suria, Bdr Puncak Alam", "k": "Puncak Alam", "lat": 3.23, "lng": 101.43},
  {"n": "Terengganu", "t": "2026-11-14", "m": "09:00", "p": "Dr Haji Abdullah Bin Mohamad", "tel": ["0135338220"], "l": "Surau At-taqwa Perumahan Alor Lintang 2 Besut Terengganu", "k": "Besut", "lat": 5.7, "lng": 102.53},
  {"n": "Terengganu", "t": "2026-11-14", "m": "09:00", "p": "Ustaz Zakwan Bin Abdul Samad", "tel": ["0179250013"], "l": "Surau Taman Exora Kg Gong Limau Kemaman", "k": "Kemaman", "lat": 4.25, "lng": 103.4},
  {"n": "Terengganu", "t": "2026-11-14", "m": "09:00", "p": "Muhammad Muazzam Bin Jayaudin", "tel": ["0192787347"], "l": "Surau Al Falah, Kampung Tok Bat, Kuala Berang", "k": "Kuala Berang", "lat": 5.07, "lng": 103.01},
  {"n": "Terengganu", "t": "2026-11-14", "m": "09:00", "p": "Ust Hj Suib Bin Kasim", "tel": ["01173096894"], "l": "Masjid Lama Kg Baru Kerteh 24300 Kerteh Kemaman Terengganu", "k": "Kerteh, Kemaman", "lat": 4.51, "lng": 103.44},
  {"n": "Pulau Pinang", "t": "2026-11-15", "m": "08:30", "p": "Ustaz Hj Zainal Bin Saparin", "tel": ["0195959272"], "l": "Masjid Al-rasyidin, Seri Ampangan, Nibong Tebal, Pulau Pinang", "k": "Nibong Tebal", "lat": 5.17, "lng": 100.48},
  {"n": "Selangor", "t": "2026-11-15", "m": "08:30", "p": "Ust Firdaus Ramlan", "tel": ["0133845574"], "l": "Masjid Jamek Fastabiqul Khayrat, No.1 Persiaran Jubli Perak, Batu Tiga, 40150 Shah Alam", "k": "Batu Tiga, Shah Alam", "lat": 3.07, "lng": 101.55},
  {"n": "Johor", "t": "2026-11-15", "m": "09:00", "p": "Ust Syahid Adam", "tel": ["0148828172"], "l": "Masjid Jamek Kg Kenangan Tun Dr Ismail 1, 84000, Bakri, Muar", "k": "Bakri, Muar", "lat": 2.03, "lng": 102.6},
  {"n": "Melaka", "t": "2026-11-15", "m": "09:00", "p": "Ust Hj Khairil Bin Hj Mokhtar", "tel": ["0196667480"], "l": "Jb 754 Taman Balqis Umbai Melaka", "k": "Umbai", "lat": 2.18, "lng": 102.32},
  {"n": "Perak", "t": "2026-11-15", "m": "09:00", "p": "Af Us Tn Haji Mustapha Faidzul Bin Hamli", "tel": ["0135813310"], "l": "Masjid Al-hambali Kg Kubang Pekan, 33000 Kuala Kangsar, Perak", "k": "Kuala Kangsar", "lat": 4.77, "lng": 100.94},
  {"n": "Terengganu", "t": "2026-11-20", "m": "09:00", "p": "Ustaz Zakwan Bin Abdul Samad", "tel": ["0179250013"], "l": "Surau Taman Exora Kg Gong Limau Kemaman", "k": "Kemaman", "lat": 4.25, "lng": 103.4},
  {"n": "Pahang", "t": "2026-11-21", "m": "08:30", "p": "Ustz Che Mat Takiyudin", "tel": ["0179221841"], "l": "Masjid Kg Ulu Dong Raub", "k": "Ulu Dong, Raub", "lat": 3.92, "lng": 101.93},
  {"n": "Perak", "t": "2026-11-21", "m": "08:30", "p": "Ustaz Hj Azhar Bin Ahmad", "tel": ["0194370226"], "l": "Masjid An Naim Kampung Pauh, Bukit Gantang, Taiping", "k": "Bukit Gantang, Taiping", "lat": 4.79, "lng": 100.73},
  {"n": "Perak", "t": "2026-11-21", "m": "08:30", "p": "Ustazah Masfueyah Binti Hamjah", "tel": ["0195774942"], "l": "Surau Al Wahid, Parit Sungai Dungun, Bagan Serai, Perak", "k": "Bagan Serai", "lat": 5.0, "lng": 100.54},
  {"n": "Sabah", "t": "2026-11-21", "m": "08:30", "p": "Ustaz Firdaus Terang", "tel": ["0138665426"], "l": "Masjid An Nur Kg Getah Kunak Sabah", "k": "Kunak", "lat": 4.69, "lng": 118.25},
  {"n": "Sabah", "t": "2026-11-21", "m": "08:30", "p": "Ustaz Faizee", "tel": ["01116410514"], "l": "Masjid Ar-rahman Pekan Ranau, Pekan Ranau, 89308 Ranau, Sabah", "k": "Ranau", "lat": 5.95, "lng": 116.67},
  {"n": "Selangor", "t": "2026-11-21", "m": "08:30", "p": "Ustaz Hj Azizi Bin Jasa", "tel": ["0192427533"], "l": "Surau Al Naim, Bernam Jaya, Kerling", "k": "Kerling, Hulu Selangor", "lat": 3.62, "lng": 101.58},
  {"n": "Kedah", "t": "2026-11-21", "m": "09:00", "p": "Ustaz Nasri Bin Yahya", "tel": ["0136090310"], "l": "Pejabat Juara Padang Serai, Kedah", "k": "Padang Serai", "lat": 5.51, "lng": 100.56},
  {"n": "Selangor", "t": "2026-11-21", "m": "09:00", "p": "Hj Sihusin Bin Nordin", "tel": ["0186679887", "0173707560", "0132718560"], "l": "Surau An Nur Tp2 Subang", "k": "Subang", "lat": 3.14, "lng": 101.55},
  {"n": "Selangor", "t": "2026-11-21", "m": "09:00", "p": "Ustaz Hj Mohammad Hasnil Abu Bakar", "tel": ["0192600430"], "l": "Masjid Al-munawwarah Seksyen 27, Shah Alam", "k": "Seksyen 27, Shah Alam", "lat": 3.03, "lng": 101.53},
  {"n": "Terengganu", "t": "2026-11-21", "m": "09:00", "p": "Ustaz Azrul Hisyam Bin Mohamad", "tel": ["0135338220"], "l": "Surau At-taqwa Perumahan Alor Lintang 2 Besut Terengganu", "k": "Besut", "lat": 5.7, "lng": 102.53},
  {"n": "Terengganu", "t": "2026-11-21", "m": "09:00", "p": "Ustaz Zakwan Bin Abdul Samad", "tel": ["0179250013"], "l": "Surau Taman Exora Kg Gong Limau Kemaman", "k": "Kemaman", "lat": 4.25, "lng": 103.4},
  {"n": "Kelantan", "t": "2026-11-21", "m": "12:00", "p": "Ustaz Noor Azhar Bin Daud", "tel": ["0133860376"], "l": "Masjid Al Aminin Kg Kijang, Kedai Buloh", "k": "Kedai Buloh, Kota Bharu", "lat": 6.1, "lng": 102.2},
  {"n": "Negeri Sembilan", "t": "2026-11-22", "m": "08:30", "p": "Ustaz Hj Ahmad Faeez Bin Abdul Halim", "tel": ["0133103906"], "l": "Surau An-nur, Jalan Kemuning 1, Taman Kemuning, 70450 Senawang, Seremban Negeri Sembilan", "k": "Senawang, Seremban", "lat": 2.69, "lng": 101.97},
  {"n": "Selangor", "t": "2026-11-22", "m": "08:30", "p": "Ustaz Hj Mohammed Salim Bin Abd Rahman", "tel": ["0122438754"], "l": "Masjid Kg Melayu Rasa, Selangor", "k": "Rasa, Hulu Selangor", "lat": 3.5, "lng": 101.63},
  {"n": "Selangor", "t": "2026-11-22", "m": "08:30", "p": "Ust Firdaus Ramlan", "tel": ["0133845574"], "l": "Surau Nur Hidayah, Jalan Petola 24/8, Seksyen 24, 40300 Shah Alam", "k": "Seksyen 24, Shah Alam", "lat": 3.04, "lng": 101.54},
  {"n": "Pahang", "t": "2026-11-22", "m": "09:00", "p": "Af Us Tn Haji Mustapha Faidzul Bin Hamli", "tel": ["01116813415"], "l": "Masjid Gugusan Mempaga, Bentong, Pahang", "k": "Mempaga, Bentong", "lat": 3.55, "lng": 101.83},
  {"n": "Perak", "t": "2026-11-22", "m": "09:00", "p": "Hajah Rohaizah Binti Khalid", "tel": ["0186335352"], "l": "Masjid Solehiah Kampung Sg Belukang 36200 Selekoh", "k": "Selekoh, Bagan Datuk", "lat": 3.95, "lng": 100.88},
  {"n": "Perak", "t": "2026-11-22", "m": "09:00", "p": "Ustaz Nasrul Hadi Bin Jamil", "tel": ["0195728786"], "l": "Masjid Al Islah, Pengkalan Aur, Simpang, Taiping", "k": "Simpang, Taiping", "lat": 4.83, "lng": 100.7},
  {"n": "Kedah", "t": "2026-11-28", "m": "08:30", "p": "Ustaz Nor Azlan Bin Ahmad", "tel": ["0194370226"], "l": "Masjid Al Irfan, Permatang Pasir, Bandar Baharu, Kedah", "k": "Bandar Baharu", "lat": 5.13, "lng": 100.5},
  {"n": "Kelantan", "t": "2026-11-28", "m": "08:30", "p": "Ustaz Noor Azhar Bin Daud", "tel": ["0133860376"], "l": "Dewan Solat Masjid Ayesha Pekan Kok Lanas", "k": "Kok Lanas, Ketereh", "lat": 5.87, "lng": 102.27},
  {"n": "Negeri Sembilan", "t": "2026-11-28", "m": "08:30", "p": "Ustaz Hj Abdul Halim Bin Abu Bakar", "tel": ["01110779784"], "l": "Masjid Jamek Gemas, Pekan Gemas, 73400 Gemas, Negeri Sembilan", "k": "Gemas", "lat": 2.58, "lng": 102.61},
  {"n": "Pahang", "t": "2026-11-28", "m": "08:30", "p": "Ustz Asrul Hazli", "tel": ["0179221841"], "l": "Masjid Lktp Tersang Raub", "k": "Tersang, Raub", "lat": 4.02, "lng": 101.86},
  {"n": "Sabah", "t": "2026-11-28", "m": "08:30", "p": "Ustaz Mohd Fazli", "tel": ["0138665426"], "l": "Masjid Ar Rahim Kg Kabogan Darat Semporna Sabah", "k": "Semporna", "lat": 4.48, "lng": 118.6},
  {"n": "Perak", "t": "2026-11-28", "m": "09:00", "p": "Penceramah Juara Travel", "tel": ["0133886480"], "l": "Masjid Taman Mawar, Kg Koh", "k": "Kampung Koh, Sitiawan", "lat": 4.24, "lng": 100.72},
  {"n": "Sabah", "t": "2026-11-28", "m": "09:00", "p": "Ustaz Zulhadi", "tel": ["01116410514"], "l": "Surau Al-ikhsan, Surau Kampung Rancangan Belia Tiulon, Daerah Sook, Keningau, Sabah", "k": "Sook, Keningau", "lat": 5.15, "lng": 116.31},
  {"n": "Selangor", "t": "2026-11-28", "m": "09:00", "p": "Ustad Mohd Suib", "tel": ["0143296800"], "l": "Masjid Felda Sg Tengi, 457, B33, Desa Maju Sungai Tengi, 44020 Kuala Kubu Baru, Selangor", "k": "Kuala Kubu Bharu", "lat": 3.58, "lng": 101.52},
  {"n": "Terengganu", "t": "2026-11-28", "m": "09:00", "p": "Ust Hj Suib Bin Kasim", "tel": ["01173096894"], "l": "Masjid Lama Kg Baru Kerteh 24300 Kerteh Kemaman Terengganu", "k": "Kerteh, Kemaman", "lat": 4.51, "lng": 103.44},
  {"n": "Negeri Sembilan", "t": "2026-11-29", "m": "08:30", "p": "Ustaz Hj Muhd Mukram Bin Mohd Kamil", "tel": ["0196679117"], "l": "Surau Al Ikhlas, Tmn Nilai Perdana, Nilai", "k": "Nilai", "lat": 2.8, "lng": 101.8},
  {"n": "Pahang", "t": "2026-11-29", "m": "08:30", "p": "Ustaz Haji Nawawi Bin Budin", "tel": ["01129219355"], "l": "Masjid Kampung Paya Luas 28000 Temerloh Pahang", "k": "Paya Luas, Temerloh", "lat": 3.45, "lng": 102.42},
  {"n": "Johor", "t": "2026-11-29", "m": "09:00", "p": "Ustaz Syahid Adam", "tel": ["0148828172"], "l": "Masjid Jamek Al-hakim, Parit Keroma, Jalan Dato’ Haji Kosai, 84000, Muar, Johor", "k": "Parit Keroma, Muar", "lat": 2.05, "lng": 102.58},
  {"n": "Johor", "t": "2026-11-29", "m": "09:00", "p": "Ustaz Hasanin Bin Tamio", "tel": ["0186679887", "0177171667", "0197515323"], "l": "Surau Al-ikhlas Perumahan Rakyat Iskandar, Jln Pasir Pelangi, Johor Bahru", "k": "Pasir Pelangi, Johor Bahru", "lat": 1.475, "lng": 103.77},
  {"n": "Pahang", "t": "2026-11-29", "m": "09:00", "p": "Af Us Tn Haji Mustapha Faidzul Bin Hamli", "tel": ["01116813415"], "l": "Masjid Tengku Abu Bakar, Raub Pahang", "k": "Bandar Raub", "lat": 3.79, "lng": 101.86},
  {"n": "Perak", "t": "2026-11-29", "m": "09:00", "p": "Ustaz Nik Abdul Malik", "tel": ["0186335352"], "l": "Surau An-nur Taman Mas 31200 Ulu Chepor Chemor, Perak", "k": "Chemor", "lat": 4.7, "lng": 101.12},
  {"n": "Sabah", "t": "2026-11-29", "m": "09:00", "p": "Ustaz Faizee", "tel": ["01116410514"], "l": "Masjid Kampung Bayangan Keningau, Kampung Bayangan, Peti Surat 72, 89007 Keningau, Sabah, Malaysia", "k": "Keningau", "lat": 5.33, "lng": 116.16},
  {"n": "Selangor", "t": "2026-11-29", "m": "09:00", "p": "Hj Razali Bin Tumirin", "tel": ["0132768470"], "l": "Surau Al-mauizhah, Bandar Hillpark, Bandar Puncak Alam", "k": "Puncak Alam", "lat": 3.25, "lng": 101.45}
];
