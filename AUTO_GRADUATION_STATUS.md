# Auto Update Status Kelulusan - Dokumentasi

## Overview
Sistem otomatis untuk mengubah status mahasiswa menjadi "Lulus" setelah 2 tahun dari angkatan mereka.

## Cara Kerja

### Logika Kelulusan
- **Angkatan 2024** → Otomatis "Lulus" di tahun **2026**
- **Angkatan 2025** → Otomatis "Lulus" di tahun **2027**
- **Angkatan 2026** → Otomatis "Lulus" di tahun **2028**

### Rumus
```
Tahun Lulus = Angkatan + 2 tahun
Status berubah jika: Tahun Sekarang >= Tahun Lulus
```

### Kondisi Update
Status akan berubah menjadi "Lulus" jika:
1. Status saat ini adalah **"Aktif"**
2. Sudah **2 tahun** atau lebih dari angkatan
3. Kolom angkatan tidak kosong

## Implementasi

### 1. Database Function & Trigger
**File**: `supabase/auto-update-status-lulus.sql`

#### Fungsi Utama:
- `auto_update_status_lulus()` - Update manual semua mahasiswa
- `check_and_update_graduation_status()` - Trigger otomatis saat update data
- `trigger_auto_graduation` - Trigger yang berjalan sebelum UPDATE

#### Cara Install:
```sql
-- Jalankan di Supabase SQL Editor
-- File: supabase/auto-update-status-lulus.sql
```

### 2. Server Action
**File**: `actions/mahasiswa.ts`

#### Function:
```typescript
autoUpdateGraduationStatusAction()
```

Memanggil database function untuk update status secara manual dari admin panel.

### 3. UI Admin Panel
**File**: `features/settings/components/settings-panel.tsx`

#### Fitur:
- Card "Update Status Kelulusan Otomatis"
- Tombol untuk menjalankan update manual
- Status feedback (success/error)
- Penjelasan cara kerja sistem

## Cara Penggunaan

### Otomatis (Recommended)
Status akan otomatis terupdate saat:
1. Data mahasiswa di-edit/update
2. Trigger database berjalan otomatis

### Manual (Via Admin Panel)
1. Login sebagai admin
2. Buka halaman **Settings** (`/settings`)
3. Scroll ke section **"Update Status Kelulusan Otomatis"**
4. Klik tombol **"Jalankan Update Status Sekarang"**
5. Konfirmasi dialog
6. Sistem akan update semua mahasiswa yang memenuhi syarat

### Manual (Via SQL)
```sql
-- Jalankan di Supabase SQL Editor
SELECT auto_update_status_lulus();
```

## Testing

### Cek Mahasiswa yang Akan Di-update
```sql
SELECT 
  id,
  full_name,
  nim,
  angkatan,
  status,
  EXTRACT(YEAR FROM CURRENT_DATE) - CAST(angkatan AS INTEGER) as tahun_kuliah
FROM mahasiswa
WHERE 
  status = 'Aktif'
  AND angkatan IS NOT NULL
  AND CAST(angkatan AS INTEGER) <= EXTRACT(YEAR FROM CURRENT_DATE) - 2;
```

### Cek Hasil Update
```sql
SELECT 
  angkatan,
  status,
  COUNT(*) as jumlah
FROM mahasiswa
GROUP BY angkatan, status
ORDER BY angkatan DESC, status;
```

## Contoh Skenario

### Tahun 2026 (Sekarang)
| Angkatan | Status Awal | Status Setelah Update | Alasan |
|----------|-------------|----------------------|---------|
| 2024 | Aktif | **Lulus** | 2026 - 2024 = 2 tahun ✅ |
| 2025 | Aktif | Aktif | 2026 - 2025 = 1 tahun ❌ |
| 2026 | Aktif | Aktif | 2026 - 2026 = 0 tahun ❌ |
| 2023 | Aktif | **Lulus** | 2026 - 2023 = 3 tahun ✅ |
| 2024 | Cuti | Cuti | Status bukan "Aktif" ❌ |
| 2024 | Lulus | Lulus | Sudah lulus ❌ |

### Tahun 2027
| Angkatan | Status Awal | Status Setelah Update |
|----------|-------------|----------------------|
| 2024 | Aktif | **Lulus** |
| 2025 | Aktif | **Lulus** |
| 2026 | Aktif | Aktif |

## Optional: Cron Job Otomatis

Jika Supabase mendukung `pg_cron`, bisa setup update otomatis setiap hari:

```sql
-- Jalankan setiap hari jam 00:00
SELECT cron.schedule(
  'auto-graduate-students',
  '0 0 * * *',
  $$ SELECT auto_update_status_lulus(); $$
);
```

## Keamanan

### RLS (Row Level Security)
- Function menggunakan `SECURITY DEFINER`
- Hanya admin yang bisa memanggil via server action
- Trigger berjalan otomatis dengan privilege database

### Validasi
- Hanya update mahasiswa dengan status "Aktif"
- Tidak mengubah mahasiswa yang sudah "Lulus", "Cuti", dll
- Validasi angkatan tidak null

## Troubleshooting

### Status Tidak Berubah
1. Cek apakah SQL sudah dijalankan di Supabase
2. Cek apakah trigger sudah aktif:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'trigger_auto_graduation';
   ```
3. Cek apakah function ada:
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'auto_update_status_lulus';
   ```

### Error saat Jalankan Manual
1. Pastikan sudah login sebagai admin
2. Cek console browser untuk error detail
3. Cek Supabase logs untuk error database

## Files Modified

1. ✅ `supabase/auto-update-status-lulus.sql` - Database function & trigger
2. ✅ `actions/mahasiswa.ts` - Server action
3. ✅ `features/settings/components/settings-panel.tsx` - UI admin panel
4. ✅ `AUTO_GRADUATION_STATUS.md` - Dokumentasi

## Next Steps

1. **Install Database Function**
   ```bash
   # Jalankan SQL di Supabase SQL Editor
   # File: supabase/auto-update-status-lulus.sql
   ```

2. **Test Manual Update**
   - Buka `/settings`
   - Klik "Jalankan Update Status Sekarang"

3. **Verify Results**
   - Cek data mahasiswa di `/mahasiswa`
   - Lihat status yang berubah menjadi "Lulus"

4. **Optional: Setup Cron Job**
   - Jika tersedia, setup cron untuk update harian otomatis
