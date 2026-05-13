# 💳 DompetKu — Aplikasi Pencatat Keuangan Sederhana

> UTS Project — Mata Kuliah Pemrograman Mobile  
> Expense Tracker berbasis React Native

---

## 👤 Identitas Mahasiswa

| Field | Detail |
|-------|--------|
| Nama | Muhammad Faried Permana |
| NIM  | 243303621239 |
| Kelas | 4 Pagi A |

---

## 📌 Deskripsi

**DompetKu** adalah aplikasi pencatat transaksi keuangan pribadi (*Expense Tracker*) yang dibangun menggunakan React Native. Aplikasi ini memungkinkan pengguna mencatat pemasukan dan pengeluaran, melihat riwayat transaksi, menghapus transaksi tertentu, serta mereset semua data sekaligus.

---

## ✅ Fitur Aplikasi

| Fitur | Keterangan |
|---|---|
| Header Saldo | Menampilkan total saldo yang berubah otomatis |
| Ringkasan | Mini card total pemasukan & pengeluaran |
| Form Input | Input deskripsi dan nominal transaksi |
| Format Ribuan Otomatis | Nominal diformat otomatis (misal: `50000` → `50.000`) |
| 2 Tombol Aksi | Tombol "Pemasukan" dan "Pengeluaran" terpisah |
| Riwayat Transaksi | Daftar transaksi menggunakan `FlatList` |
| Warna Nominal | Hijau untuk pemasukan, Merah untuk pengeluaran |
| Hapus Per Transaksi | Tombol ✕ di setiap item dengan konfirmasi `Alert` |
| Reset Semua | Hapus seluruh transaksi sekaligus dengan konfirmasi |
| Validasi Input | Alert jika deskripsi kosong atau nominal tidak valid |
| Empty State | Tampilan khusus saat belum ada transaksi |

---

## 📸 Screenshot

| Tampilan utama dengan daftar task | Filter Selesai aktif | 
|---|---|---|
| ![Login](./assets/homeee.jpg) | ![Register](./assets/homee2.jpg) |

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js (v18 atau lebih baru)
- React Native CLI atau Expo CLI
- Android Studio / Xcode (untuk emulator)

### Langkah

**1. Buat project baru (jika belum ada)**
```bash
npx react-native init DompetKu
# atau pakai Expo:
npx create-expo-app DompetKu
```

**2. Copy file ke dalam project**
```bash
cp index.tsx ./DompetKu/
```

**3. Daftarkan di App.js**
```js
import DompetKu from './index';

export default function App() {
  return <DompetKu />;
}
```

**4. Jalankan aplikasi**

```bash
# 1. Clone repository
git clone https://github.com/fariidd04/dompetku.git
cd dompetku

# 2. Install dependencies
npm install

# 3. Jalankan development server
npx expo start

# 4. Scan QR Code dengan Expo Go (Android) atau Camera (iOS)
```
---

## 📱 Tampilan Aplikasi

```
┌─────────────────────────────────────┐
│  💳 SALDO SAAT INI                  │  ← Header biru
│  Rp 0                          │
│  [↑ Pemasukan Rp X] [↓ Keluar Rp Y]│
├─────────────────────────────────────┤
│  + Tambah Transaksi                 │  ← Form input
│  Deskripsi: [___________________]   │
│  Nominal:   [___________________]   │  ← Auto-format ribuan
│  [↑ Pemasukan]    [↓ Pengeluaran]   │
├─────────────────────────────────────┤
│  🕐 RIWAYAT TRANSAKSI   🗑 Reset    │  ← Reset Semua (muncul jika ada data)
│  ┌───────────────────────────────┐  │
│  │ ↑ Uang Bulanan    +Rp 2.00.000 ✕ │  │  ← Nominal HIJAU, tombol hapus ✕
│  ├───────────────────────────────┤  │
│  │ ↓ Makanan   -Rp 30.000  ✕ │  │  ← Nominal MERAH, tombol hapus ✕
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## 🛠️ Komponen & API React Native yang Digunakan

| Komponen / API | Kegunaan |
|---|---|
| `useState` | Mengelola state transaksi dan input form |
| `FlatList` | Menampilkan daftar riwayat transaksi |
| `TextInput` | Input deskripsi dan nominal |
| `TouchableOpacity` | Tombol Pemasukan, Pengeluaran, Hapus, dan Reset |
| `StyleSheet` | Styling seluruh komponen |
| `SafeAreaView` | Menghindari notch/status bar |
| `StatusBar` | Mengatur warna & style status bar |
| `KeyboardAvoidingView` | Form tidak tertutup keyboard saat mengetik |
| `Alert` | Konfirmasi hapus dan validasi input |

---

## 🔗 Live Demo

- [Expo Snack](https://snack.expo.dev/@fariid.dd/dompetku)

---