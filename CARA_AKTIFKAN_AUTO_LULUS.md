# 🎓 Cara Mengaktifkan Auto Update Status Lulus

## ⚠️ PENTING: SQL Belum Dijalankan!

Mahasiswa angkatan 2023 masih berstatus "Aktif" karena SQL belum dijalankan di Supabase.

## 📋 Langkah-Langkah (5 Menit)

### 1. Buka Supabase Dashboard
- Login ke https://supabase.com
- Pilih project KTM Management

### 2. Buka SQL Editor
- Klik menu **"SQL Editor"** di sidebar kiri
- Atau klik **"New Query"**

### 3. Copy & Paste SQL
- Buka file: `supabase/JALANKAN-INI-UNTUK-AUTO-LULUS.sql`
- **Copy SEMUA isi file** (Ctrl+A, Ctrl+C)
- **Paste** di SQL Editor Supabase (Ctrl+V)

### 4. Jalankan SQL
- Klik tombol **"Run"** (atau tekan Ctrl+Enter)
- Tunggu sampai selesai (biasanya < 5 detik)

### 5. Cek Hasil
SQL akan otomatis menampilkan:
- Jumlah mahasiswa yang di-update
- List mahasiswa yang berubah status
- Ringkasan per angkatan

## ✅ Hasil yang Diharapkan

Setelah SQL dijalankan:

### Mahasiswa yang Akan Berubah Status:
| Angkatan | Status Sebelum | Status Sesudah | Alasan |
|----------|----------------|----------------|---------|
| 2023 | Aktif | **Lulus** | 2026 - 2023 = 3 tahun ✅ |
| 2024 | Aktif | **Lulus** | 2026 - 2024 = 2 tahun ✅ |
| 2025 | Aktif | Aktif | 2026 - 2025 = 1 tahun ❌ |

### Contoh Output SQL:
```
NOTICE: Berhasil update 2 mahasiswa menjadi Lulus

updated_count
-------------
2

nama              | nim        | angkatan | status | lama_kuliah_tahun
------------------|------------|----------|--------|------------------
test buka         | 203522883  | 2023     | Lulus  | 3
M Rival maulana   | 205522007  | 2025     | Aktif  | 1
```

## 🔄 Setelah SQL Dijalankan

Sistem akan otomatis:

### 1. Update Otomatis (Trigger)
- Saat data mahasiswa di-edit
- Trigger akan cek dan update status jika perlu

### 2. Update Manual (Admin Panel)
- Buka `/settings`
- Klik "Jalankan Update Status Sekarang"
- Sistem update semua mahasiswa yang memenuhi syarat

### 3. Update Manual (SQL)
```sql
SELECT * FROM auto_update_status_lulus();
```

## 🧪 Testing

### Cek Mahasiswa yang Harus Lulus:
```sql
SELECT 
  full_name,
  nim,
  angkatan,
  status,
  EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER - CAST(angkatan AS INTEGER) as tahun_kuliah
FROM mahasiswa
WHERE 
  status = 'Aktif'
  AND angkatan IS NOT NULL
  AND CAST(angkatan AS INTEGER) <= EXTRACT(YEAR FROM CURRENT_DATE) - 2;
```

### Cek Ringkasan Status:
```sql
SELECT 
  angkatan,
  status,
  COUNT(*) as jumlah
FROM mahasiswa
WHERE angkatan IS NOT NULL
GROUP BY angkatan, status
ORDER BY angkatan DESC;
```

## ❓ Troubleshooting

### SQL Error: "function already exists"
Tidak masalah, artinya function sudah ada. SQL akan replace dengan versi baru.

### Tidak Ada Mahasiswa yang Di-update
Kemungkinan:
1. Semua mahasiswa angkatan lama sudah berstatus "Lulus"
2. Tidak ada mahasiswa dengan status "Aktif" yang sudah 2 tahun
3. Kolom angkatan kosong (NULL)

### Status Masih Belum Berubah di UI
1. Refresh halaman (F5)
2. Clear cache browser (Ctrl+Shift+R)
3. Logout dan login kembali

## 📞 Butuh Bantuan?

Jika masih ada masalah:
1. Screenshot error message dari Supabase
2. Cek Supabase logs: Dashboard → Logs → Postgres Logs
3. Pastikan RLS policies tidak memblokir update

## 🎯 Checklist

- [ ] Buka Supabase Dashboard
- [ ] Buka SQL Editor
- [ ] Copy SQL dari file `JALANKAN-INI-UNTUK-AUTO-LULUS.sql`
- [ ] Paste dan Run di SQL Editor
- [ ] Cek output: berapa mahasiswa yang di-update?
- [ ] Refresh halaman Data Mahasiswa
- [ ] Verifikasi: Mahasiswa angkatan 2023-2024 sudah "Lulus"
- [ ] Test: Edit data mahasiswa → status otomatis update
- [ ] Test: Klik tombol di Settings page → berhasil

## ✨ Selesai!

Setelah SQL dijalankan, sistem akan bekerja otomatis dan tidak perlu setting lagi.
