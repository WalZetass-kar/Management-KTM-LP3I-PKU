# 🎓 Penjelasan Auto Status Lulus

## Cara Kerja Sistem

Sistem akan **OTOMATIS** set status "Lulus" jika mahasiswa sudah 2 tahun dari angkatan, **TIDAK PEDULI** kapan data ditambahkan.

## Contoh Skenario (Tahun Sekarang: 2026)

### Skenario 1: Tambah Mahasiswa Baru Hari Ini
| Angkatan Input | Status yang Dipilih | Status Akhir di Database | Alasan |
|----------------|---------------------|--------------------------|---------|
| 2023 | Aktif | **Lulus** ✅ | 2026 - 2023 = 3 tahun (sudah lulus) |
| 2024 | Aktif | **Lulus** ✅ | 2026 - 2024 = 2 tahun (sudah lulus) |
| 2025 | Aktif | **Aktif** | 2026 - 2025 = 1 tahun (belum lulus) |
| 2026 | Aktif | **Aktif** | 2026 - 2026 = 0 tahun (baru masuk) |

### Skenario 2: Edit Mahasiswa yang Sudah Ada
| Angkatan | Status Sebelum | Status Setelah Edit | Alasan |
|----------|----------------|---------------------|---------|
| 2023 | Aktif | **Lulus** ✅ | Otomatis berubah saat edit |
| 2024 | Cuti | Cuti | Tidak berubah (status bukan "Aktif") |
| 2025 | Aktif | Aktif | Belum 2 tahun |

### Skenario 3: Import Excel Hari Ini
```csv
nama,nim,jurusan,angkatan,alamat,no_hp,status
Budi,2023001,TI,2023,Jl. A,08111,Aktif
Ani,2024001,SI,2024,Jl. B,08222,Aktif
Citra,2025001,TI,2025,Jl. C,08333,Aktif
```

**Hasil di Database:**
- Budi (2023) → Status: **Lulus** ✅ (otomatis)
- Ani (2024) → Status: **Lulus** ✅ (otomatis)
- Citra (2025) → Status: **Aktif** (belum 2 tahun)

## Kapan Trigger Berjalan?

### 1. Saat Tambah Mahasiswa Baru (INSERT)
```
Admin tambah mahasiswa:
- Nama: John Doe
- Angkatan: 2023
- Status dipilih: Aktif

↓ Trigger jalan otomatis ↓

Database simpan:
- Nama: John Doe
- Angkatan: 2023
- Status: Lulus ✅ (otomatis berubah)
```

### 2. Saat Edit Mahasiswa (UPDATE)
```
Admin edit mahasiswa:
- Angkatan diubah dari 2025 → 2023
- Status masih: Aktif

↓ Trigger jalan otomatis ↓

Database update:
- Angkatan: 2023
- Status: Lulus ✅ (otomatis berubah)
```

### 3. Saat Import Excel/CSV
```
Upload file dengan mahasiswa angkatan 2023

↓ Trigger jalan untuk setiap row ↓

Semua mahasiswa angkatan 2023 → Status: Lulus ✅
```

## Kondisi yang Harus Dipenuhi

Status akan otomatis jadi "Lulus" jika:
1. ✅ Angkatan tidak kosong (NULL)
2. ✅ Status yang dipilih adalah "Aktif"
3. ✅ Sudah 2 tahun atau lebih dari angkatan

Status TIDAK akan berubah jika:
- ❌ Status bukan "Aktif" (misal: Cuti, Tidak Aktif, Menunggu)
- ❌ Angkatan kosong
- ❌ Belum 2 tahun dari angkatan

## Testing

### Test 1: Tambah Mahasiswa Angkatan Lama
1. Buka `/mahasiswa/tambah`
2. Isi form:
   - Nama: Test Lulus
   - NIM: 2023999
   - Angkatan: **2023**
   - Status: **Aktif**
3. Klik Simpan
4. **Expected**: Status otomatis jadi "Lulus" di database

### Test 2: Import Excel dengan Angkatan Lama
1. Buka `/mahasiswa`
2. Klik "Import Excel"
3. Upload file dengan angkatan 2023-2024
4. **Expected**: Semua mahasiswa angkatan 2023-2024 status "Lulus"

### Test 3: Edit Angkatan Mahasiswa
1. Edit mahasiswa yang angkatan 2025
2. Ubah angkatan jadi 2023
3. Klik Simpan
4. **Expected**: Status otomatis jadi "Lulus"

## Keuntungan Sistem Ini

### ✅ Tidak Perlu Manual
- Admin tidak perlu ganti status manual
- Sistem otomatis cek saat input data

### ✅ Konsisten
- Semua mahasiswa angkatan lama pasti status "Lulus"
- Tidak ada yang terlewat

### ✅ Real-time
- Langsung jalan saat tambah/edit data
- Tidak perlu tunggu cron job

### ✅ Fleksibel
- Bisa tambah data mahasiswa lama kapan saja
- Status otomatis sesuai angkatan

## FAQ

### Q: Bagaimana jika mahasiswa angkatan 2023 masih kuliah (belum lulus)?
**A:** Saat tambah/edit, pilih status selain "Aktif" (misal: "Cuti" atau "Tidak Aktif"). Trigger hanya bekerja untuk status "Aktif".

### Q: Bagaimana jika ingin mahasiswa angkatan lama tetap "Aktif"?
**A:** Setelah data tersimpan, edit manual dan ubah status kembali ke "Aktif". Atau pilih status lain saat input pertama kali.

### Q: Apakah bisa dimatikan fitur ini?
**A:** Ya, jalankan SQL:
```sql
DROP TRIGGER IF EXISTS trigger_auto_graduation_insert ON mahasiswa;
DROP TRIGGER IF EXISTS trigger_auto_graduation_update ON mahasiswa;
```

### Q: Bagaimana jika ingin ubah dari 2 tahun jadi 3 tahun?
**A:** Edit function `check_and_update_graduation_status()` dan ubah `- 2` jadi `- 3`.

## File SQL yang Harus Dijalankan

**Pilih salah satu:**

1. **`supabase/FIX-AUTO-LULUS-FINAL.sql`** (Recommended)
   - Setup lengkap dengan trigger INSERT dan UPDATE
   - Update data lama yang sudah ada
   - Siap pakai

2. **`supabase/quick-fix-status-lulus.sql`**
   - Hanya update data lama
   - Tidak ada trigger untuk data baru
   - Untuk quick fix saja

## Kesimpulan

Setelah SQL dijalankan:
- ✅ Semua mahasiswa lama (2023-2024) otomatis "Lulus"
- ✅ Tambah mahasiswa baru angkatan lama → Otomatis "Lulus"
- ✅ Edit mahasiswa → Otomatis cek dan update status
- ✅ Import Excel → Otomatis cek setiap row

**Sistem bekerja otomatis, admin tidak perlu khawatir lupa update status!**
