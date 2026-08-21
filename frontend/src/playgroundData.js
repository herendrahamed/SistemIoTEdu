export const playgroundSteps = ["Try", "See", "Change", "Break", "Discover", "Challenge", "Build"];

export const playgroundData = [
  ["First Spark", "Nyalakan LED, kedipan, pola", "SOS"],
  ["Make It React", "Tombol & interaksi", "Mini game"],
  ["Make It Feel", "Potentiometer & sensor nilai", "Speed controller"],
  ["Give ESP32 Senses", "Membaca sensor & batas", "Alarm sederhana"],
  ["Make It Talk", "UART / console text", "Console robot"],
  ["Give It a Face", "Display angka/teks/animasi", "Dashboard mini"],
  ["Make Many Things Happen", "Pengenalan multitasking natural", "3 pekerjaan bersamaan"],
  ["Make Them Share", "Concurrency, Queue, Mutex karena sistem rusak/race condition", "Perbaiki sistem"],
  ["Make ESP32 Go Online", "Wi-Fi & kontrol via browser", "Remote control"],
  ["Make ESP32 Talk to ESP32", "Komunikasi antar perangkat", "Mini smart-home"],
  ["Build Something", "Pilih misi dan gabungkan kemampuanmu", "Smart Lamp, Alarm, Weather Station, Smart Plant, Car, Robot, Smart Home, Game"],
  ["Create Your Own", "Sandbox terbuka: pilih Input, Output, Konektivitas, Logika bebas", "Proyek bebas"],
].map(([title, focus, challenge], index) => ({
  id: `play-${index}`,
  number: String(index + 1).padStart(2, "0"),
  title,
  focus,
  challenge,
}));

export const playgroundStepCopy = {
  Try: "Coba eksperimen kecilnya dan lihat apa yang terjadi saat kamu menekan tombol mulai.",
  See: "Amati perubahan pada output ESP32 dan hubungkan hasilnya dengan input yang kamu berikan.",
  Change: "Ubah satu nilai, pola, atau baris logika lalu bandingkan hasilnya dengan percobaan awal.",
  Break: "Sengaja buat sistemnya ‘rusak’. Kesalahan adalah petunjuk paling seru untuk belajar.",
  Discover: "Temukan alasan di balik perilaku sistem dan catat pola yang kamu lihat.",
  Challenge: "Tantanganmu: selesaikan misi ini dengan kreativitasmu sendiri.",
  Build: "Gabungkan ide-ide tadi menjadi sesuatu yang bisa kamu tunjukkan dan kembangkan.",
};