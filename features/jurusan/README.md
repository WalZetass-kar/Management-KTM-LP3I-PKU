# Fitur Manajemen Jurusan

Modul lengkap untuk mengelola data jurusan/program studi dalam sistem KTM Management.

## 📋 Daftar Isi

- [Overview](#overview)
- [Database Schema](#database-schema)
- [Struktur File](#struktur-file)
- [Cara Penggunaan](#cara-penggunaan)
- [API & Functions](#api--functions)
- [Komponen UI](#komponen-ui)
- [Validasi](#validasi)

---

## Overview

Fitur ini memungkinkan admin untuk:
- ✅ Menambah jurusan baru
- ✅ Mengedit nama jurusan
- ✅ Menghapus jurusan (dengan validasi)
- ✅ Mencari jurusan
- ✅ Melihat daftar jurusan dengan pagination

### Screenshot Fitur

**Halaman Jurusan:**
- Tabel data jurusan
- Search bar
- Tombol tambah jurusan
- Aksi edit & delete per row

**Modal Form:**
- Input nama jurusan
- Validasi realtime
- Mode tambah & edit

---

## Database Schema

### Tabel: `jurusan`

```sql
CREATE TABLE jurusan (
  id SERIAL PRIMARY KEY,
  nama_jurusan TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```

**Kolom:**
- `id` - Primary key (auto increment)
- `nama_jurusan` - Nama jurusan (unique, required)
- `created_at` - Timestamp pembuatan
- `updated_at` - Timestamp update terakhir

**Indexes:**
- Primary key pada `id`
- Unique constraint pada `nama_jurusan`

### Relasi dengan Tabel `mahasiswa`

```sql
ALTER TABLE mahasiswa 
ADD COLUMN jurusan_id INTEGER REFERENCES jurusan(id);

CREATE INDEX idx_mahasiswa_jurusan_id ON mahasiswa(jurusan_id);
```

**Foreign Key:**
- `mahasiswa.jurusan_id` → `jurusan.id`
- Cascade behavior: RESTRICT (tidak bisa hapus jurusan yang masih digunakan)

### Data Default

```sql
INSERT INTO jurusan (nama_jurusan) VALUES
  ('Hubungan Masyarakat'),
  ('Administrasi Bisnis'),
  ('Management Informatika'),
  ('Komputerisasi Akuntansi');
```

---

## Struktur File

```
features/jurusan/
├── components/
│   ├── jurusan-table.tsx          # Tabel utama dengan CRUD
│   ├── jurusan-form-modal.tsx     # Modal form add/edit
│   └── jurusan-skeleton.tsx       # Loading skeleton
└── README.md                       # Dokumentasi ini

app/jurusan/
├── page.tsx                        # Halaman utama
└── loading.tsx                     # Loading state

lib/
└── jurusan.ts                      # Helper functions

actions/
└── jurusan.ts                      # Server actions

types/
└── jurusan.ts                      # TypeScript interfaces

supabase/
└── create-jurusan-table.sql       # Database migration
```

---

## Cara Penggunaan

### 1. Setup Database

Jalankan migration SQL:

```bash
# Via Supabase Dashboard
# Copy paste isi file: supabase/create-jurusan-table.sql
```

Atau via CLI:

```bash
supabase db push
```

### 2. Akses Halaman Jurusan

1. Login sebagai admin
2. Klik menu "Jurusan" di sidebar
3. URL: `/jurusan`

### 3. Operasi CRUD

**Tambah Jurusan:**
1. Klik tombol "Tambah Jurusan"
2. Isi nama jurusan di modal
3. Klik "Simpan"

**Edit Jurusan:**
1. Klik icon edit (pensil) pada row
2. Ubah nama jurusan di modal
3. Klik "Perbarui"

**Hapus Jurusan:**
1. Klik icon delete (trash) pada row
2. Konfirmasi penghapusan
3. Jurusan akan dihapus (jika tidak ada mahasiswa terkait)

**Search Jurusan:**
1. Ketik nama jurusan di search bar
2. Hasil akan difilter secara realtime

---

## API & Functions

### Server Actions (`actions/jurusan.ts`)

#### `createJurusanAction()`

Menambah jurusan baru.

```typescript
const formData = new FormData();
formData.append("namaJurusan", "Teknik Informatika");

const result = await createJurusanAction(initialState, formData);
// Returns: { status: "success" | "error", message: string }
```

**Validasi:**
- Nama jurusan wajib diisi
- Minimal 3 karakter
- Maksimal 100 karakter
- Tidak boleh duplikat

**Redirect:**
- Success: `/jurusan?status=created`

---

#### `updateJurusanAction()`

Mengupdate jurusan existing.

```typescript
const formData = new FormData();
formData.append("id", "1");
formData.append("namaJurusan", "Teknik Informatika (Updated)");

const result = await updateJurusanAction(initialState, formData);
```

**Redirect:**
- Success: `/jurusan?status=updated`

---

#### `deleteJurusanAction()`

Menghapus jurusan.

```typescript
const result = await deleteJurusanAction(jurusanId);
// Returns: { status: "success" | "error", message: string }
```

**Validasi:**
- Cek apakah jurusan masih digunakan mahasiswa
- Jika masih digunakan, return error

---

### Library Functions (`lib/jurusan.ts`)

#### `getJurusanList()`

Mengambil semua data jurusan.

```typescript
const { data, error } = await getJurusanList();
// data: JurusanRecord[]
// error: string | null
```

**Return:**
```typescript
{
  data: [
    {
      id: 1,
      namaJurusan: "Hubungan Masyarakat",
      createdAt: "2026-04-20T10:00:00Z",
      updatedAt: null
    }
  ],
  error: null
}
```

---

#### `getJurusanById()`

Mengambil data jurusan by ID.

```typescript
const { data, error } = await getJurusanById(1);
// data: JurusanRecord | null
```

---

#### `validateJurusanFormValues()`

Validasi form values.

```typescript
const values = { namaJurusan: "TI" };
const errorMessage = validateJurusanFormValues(values);
// Returns: string | null
```

**Validasi Rules:**
- Required: Nama jurusan wajib diisi
- Min length: 3 karakter
- Max length: 100 karakter

---

#### `normalizeJurusanFormValues()`

Normalize form data.

```typescript
const formData = new FormData();
const values = normalizeJurusanFormValues(formData);
// Returns: JurusanFormValues
```

---

## Komponen UI

### `<JurusanTable />`

Komponen utama untuk menampilkan tabel jurusan.

**Props:**
```typescript
interface JurusanTableProps {
  jurusanList: JurusanRecord[];
  errorMessage?: string | null;
  noticeMessage?: string | null;
}
```

**Features:**
- Search/filter by nama
- Pagination (10 items per page)
- Edit & delete actions
- Success/error notifications
- Empty state handling

**Usage:**
```tsx
<JurusanTable
  jurusanList={data}
  errorMessage={error}
  noticeMessage="Jurusan berhasil ditambahkan"
/>
```

---

### `<JurusanFormModal />`

Modal form untuk tambah/edit jurusan.

**Props:**
```typescript
interface JurusanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingJurusan: JurusanRecord | null;
}
```

**Features:**
- Mode tambah & edit
- Form validation
- Loading states
- Error messages
- Auto-reset on close

**Usage:**
```tsx
<JurusanFormModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  editingJurusan={selectedJurusan}
/>
```

---

### `<JurusanSkeleton />`

Loading skeleton untuk halaman jurusan.

**Usage:**
```tsx
// app/jurusan/loading.tsx
export default function Loading() {
  return <JurusanSkeleton />;
}
```

---

## Validasi

### Client-Side Validation

**HTML5 Validation:**
- `required` attribute pada input
- `minlength` & `maxlength` (via validation function)

### Server-Side Validation

**Function: `validateJurusanFormValues()`**

```typescript
// Validasi 1: Required
if (!values.namaJurusan) {
  return "Nama jurusan wajib diisi.";
}

// Validasi 2: Min Length
if (values.namaJurusan.length < 3) {
  return "Nama jurusan minimal 3 karakter.";
}

// Validasi 3: Max Length
if (values.namaJurusan.length > 100) {
  return "Nama jurusan maksimal 100 karakter.";
}
```

### Database Validation

**Unique Constraint:**
```sql
nama_jurusan TEXT UNIQUE NOT NULL
```

**Error Handling:**
```typescript
if (error.code === "23505") {
  return { status: "error", message: "Nama jurusan sudah ada." };
}
```

**Foreign Key Constraint:**
```typescript
// Cek sebelum delete
const { data: mahasiswaCount } = await supabase
  .from("mahasiswa")
  .select("id", { count: "exact" })
  .eq("jurusan_id", jurusanId);

if (mahasiswaCount && mahasiswaCount.length > 0) {
  return {
    status: "error",
    message: "Jurusan tidak dapat dihapus karena masih digunakan."
  };
}
```

---

## TypeScript Interfaces

### `JurusanRecord`

```typescript
interface JurusanRecord {
  id: number;
  namaJurusan: string;
  createdAt: string;
  updatedAt: string | null;
}
```

### `JurusanFormValues`

```typescript
interface JurusanFormValues {
  namaJurusan: string;
}
```

---

## Styling & Theme

**Warna:**
- Primary: Blue (sidebar theme)
- Success: Green (badge, notifications)
- Error: Red (error messages, delete button)
- Warning: Yellow (status badges)

**Tailwind Classes:**
- Card: `rounded-2xl border bg-white`
- Button: `rounded-xl px-4 py-2`
- Input: `rounded-xl border px-3 py-2`
- Modal: `fixed z-50 rounded-2xl shadow-xl`

**Responsive:**
- Mobile: Stack layout, full-width buttons
- Tablet: 2-column grid
- Desktop: Horizontal layout, sidebar navigation

---

## Error Handling

### Error Types

1. **Validation Error**
   - Message: "Nama jurusan wajib diisi"
   - Display: Red alert box di form

2. **Duplicate Error**
   - Message: "Nama jurusan sudah ada"
   - Display: Red alert box di form

3. **Foreign Key Error**
   - Message: "Jurusan tidak dapat dihapus karena masih digunakan"
   - Display: Red notification

4. **Network Error**
   - Message: "Gagal menghubungi server"
   - Display: Red notification

### Success Messages

1. **Create Success**
   - Message: "Jurusan baru berhasil ditambahkan"
   - Display: Green notification
   - Redirect: `/jurusan?status=created`

2. **Update Success**
   - Message: "Data jurusan berhasil diperbarui"
   - Display: Green notification
   - Redirect: `/jurusan?status=updated`

3. **Delete Success**
   - Message: "Jurusan berhasil dihapus"
   - Display: Green notification
   - Action: Refresh page

---

## Testing Checklist

### Functional Testing

- [ ] Tambah jurusan baru
- [ ] Edit jurusan existing
- [ ] Hapus jurusan (tanpa mahasiswa)
- [ ] Hapus jurusan (dengan mahasiswa) - harus error
- [ ] Search jurusan
- [ ] Pagination (jika > 10 items)
- [ ] Validasi form (empty, too short)
- [ ] Duplicate nama jurusan - harus error

### UI Testing

- [ ] Modal open/close
- [ ] Loading states
- [ ] Error messages display
- [ ] Success notifications
- [ ] Responsive layout (mobile, tablet, desktop)
- [ ] Skeleton loading

### Integration Testing

- [ ] Sidebar navigation ke /jurusan
- [ ] Relasi dengan tabel mahasiswa
- [ ] Revalidation setelah CRUD
- [ ] Auth check (hanya admin)

---

## Future Enhancements

1. **Bulk Operations**
   - Import jurusan dari CSV/Excel
   - Export data jurusan

2. **Advanced Filters**
   - Filter by created date
   - Sort by nama/date

3. **Jurusan Details**
   - Deskripsi jurusan
   - Kode jurusan
   - Akreditasi

4. **Statistics**
   - Jumlah mahasiswa per jurusan
   - Chart/grafik distribusi

5. **Soft Delete**
   - Archive jurusan instead of hard delete
   - Restore functionality

---

## Troubleshooting

### Issue: "Jurusan tidak muncul di dropdown mahasiswa"

**Solution:**
- Pastikan migration sudah dijalankan
- Cek data di tabel `jurusan` via Supabase dashboard
- Refresh browser cache

### Issue: "Error saat hapus jurusan"

**Solution:**
- Cek apakah ada mahasiswa dengan `jurusan_id` tersebut
- Hapus/update mahasiswa terlebih dahulu
- Atau gunakan soft delete

### Issue: "Modal tidak menutup setelah submit"

**Solution:**
- Cek network tab untuk error
- Pastikan redirect berhasil
- Clear browser cache

---

## Support

Untuk pertanyaan atau issue, hubungi:
- Developer: Tim Development KTM Management
- Email: support@lp3i-pku.ac.id
- Dokumentasi: `/DOKUMENTASI_SISTEM.md`
