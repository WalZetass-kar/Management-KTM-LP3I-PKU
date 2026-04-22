# 🔧 Fix Dashboard - Dropdown Angkatan

## 🐛 Bug yang Diperbaiki

**MASALAH:**
- Dashboard hanya menampilkan angkatan 2026 di dropdown
- Grafik menampilkan data angkatan 2025
- Dropdown tidak menampilkan semua angkatan yang ada

**PENYEBAB:**
- Fungsi `getAvailableYears()` mengambil tahun dari kolom `created_at` (kapan data dibuat)
- Seharusnya mengambil dari kolom `angkatan` (tahun angkatan mahasiswa)
- Fungsi `getStudentsByJurusanAndYear()` filter berdasarkan `created_at`, bukan `angkatan`

**CONTOH MASALAH:**
```
Mahasiswa A:
- created_at: 2026-01-15 (data dibuat tahun 2026)
- angkatan: "2025" (mahasiswa angkatan 2025)

❌ Sebelum fix: Dropdown menampilkan 2026 (dari created_at)
✅ Setelah fix: Dropdown menampilkan 2025 (dari angkatan)
```

---

## ✅ Solusi

### 1. Fix `getAvailableYears()` di `lib/dashboard.ts`

**Sebelum:**
```typescript
// Mengambil tahun dari created_at
const { data, error } = await supabase
  .from("mahasiswa")
  .select("created_at")
  .order("created_at", { ascending: true });

const years = new Set<number>();
data.forEach((item) => {
  const year = new Date(item.created_at).getFullYear(); // ❌ Salah!
  years.add(year);
});
```

**Sesudah:**
```typescript
// Prioritas 1: Ambil dari tabel angkatan (master data)
const { data: angkatanData, error: angkatanError } = await supabase
  .from("angkatan")
  .select("tahun")
  .eq("status", "Aktif")
  .order("tahun", { ascending: false });

if (!angkatanError && angkatanData && angkatanData.length > 0) {
  const years = angkatanData.map(item => parseInt(item.tahun));
  return { data: years, error: null };
}

// Prioritas 2: Fallback ke kolom mahasiswa.angkatan
const { data, error } = await supabase
  .from("mahasiswa")
  .select("angkatan")
  .not("angkatan", "is", null)
  .order("angkatan", { ascending: false });

const years = new Set<number>();
data.forEach((item) => {
  if (item.angkatan) {
    const year = parseInt(item.angkatan); // ✅ Benar!
    if (!isNaN(year)) {
      years.add(year);
    }
  }
});
```

### 2. Fix `getStudentsByJurusanAndYear()` di `lib/dashboard.ts`

**Sebelum:**
```typescript
// Filter berdasarkan created_at
const startDate = new Date(targetYear, 0, 1);
const endDate = new Date(targetYear, 11, 31, 23, 59, 59);

const { count, error } = await supabase
  .from("mahasiswa")
  .select("*", { count: "exact", head: true })
  .eq("jurusan", jurusan.nama_jurusan)
  .gte("created_at", startDate.toISOString()) // ❌ Salah!
  .lte("created_at", endDate.toISOString());   // ❌ Salah!
```

**Sesudah:**
```typescript
// Filter berdasarkan kolom angkatan
const { count, error } = await supabase
  .from("mahasiswa")
  .select("*", { count: "exact", head: true })
  .eq("jurusan", jurusan.nama_jurusan)
  .eq("angkatan", String(targetYear)); // ✅ Benar!
```

---

## 🎯 Hasil Setelah Fix

### Dropdown Angkatan:
- ✅ Menampilkan semua angkatan dari tabel `angkatan` (jika ada)
- ✅ Fallback ke kolom `mahasiswa.angkatan` (jika tabel angkatan kosong)
- ✅ Sorted descending (terbaru di atas)

### Grafik Mahasiswa per Jurusan:
- ✅ Menampilkan data berdasarkan angkatan yang dipilih
- ✅ Filter berdasarkan kolom `angkatan`, bukan `created_at`
- ✅ Data konsisten dengan dropdown

---

## 🧪 Testing

### Test 1: Cek Dropdown Angkatan
1. Buka `/dashboard`
2. Lihat dropdown di bagian "Mahasiswa per Jurusan"
3. ✅ Harus menampilkan semua angkatan yang ada (2024, 2025, 2026, dll)

### Test 2: Cek Grafik per Angkatan
1. Pilih angkatan 2025 dari dropdown
2. ✅ Grafik harus menampilkan data mahasiswa angkatan 2025
3. Pilih angkatan 2026 dari dropdown
4. ✅ Grafik harus menampilkan data mahasiswa angkatan 2026

### Test 3: Verifikasi Data di Database
```sql
-- Cek angkatan yang tersedia
SELECT DISTINCT angkatan 
FROM mahasiswa 
WHERE angkatan IS NOT NULL
ORDER BY angkatan DESC;

-- Cek jumlah mahasiswa per angkatan per jurusan
SELECT 
  angkatan,
  jurusan,
  COUNT(*) as jumlah
FROM mahasiswa
GROUP BY angkatan, jurusan
ORDER BY angkatan DESC, jurusan;
```

---

## 📊 Contoh Data

### Sebelum Fix:
```
Dropdown: [2026] ← Hanya 1 tahun (dari created_at)
Grafik (2026): 0 mahasiswa ← Tidak ada data karena filter salah
```

### Setelah Fix:
```
Dropdown: [2026, 2025, 2024] ← Semua angkatan (dari kolom angkatan)
Grafik (2025): 
  - Teknik Informatika: 15 mahasiswa
  - Sistem Informasi: 10 mahasiswa
  - dll.
```

---

## 🔍 Verifikasi

### Cek Fungsi `getAvailableYears()`:
```typescript
// Test di console atau API route
const result = await getAvailableYears();
console.log(result.data); 
// Expected: [2026, 2025, 2024, ...] (dari kolom angkatan)
```

### Cek Fungsi `getStudentsByJurusanAndYear()`:
```typescript
// Test untuk angkatan 2025
const result = await getStudentsByJurusanAndYear(2025);
console.log(result.data);
// Expected: [
//   { jurusan: "Teknik Informatika", count: 15 },
//   { jurusan: "Sistem Informasi", count: 10 },
//   ...
// ]
```

---

## 📝 File yang Diubah

1. ✅ `lib/dashboard.ts`
   - Function `getAvailableYears()` - Ambil dari tabel angkatan atau kolom angkatan
   - Function `getStudentsByJurusanAndYear()` - Filter by angkatan column

---

## 🎉 Kesimpulan

**Fix berhasil!** Dashboard sekarang:
- ✅ Dropdown menampilkan semua angkatan yang ada
- ✅ Grafik menampilkan data sesuai angkatan yang dipilih
- ✅ Data konsisten antara dropdown dan grafik
- ✅ Menggunakan master data dari tabel `angkatan`

**Tidak perlu migration SQL** - Hanya perubahan kode TypeScript!
