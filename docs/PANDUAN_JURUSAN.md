# 📚 Panduan Singkat: Manajemen Jurusan

Panduan cepat untuk admin dalam mengelola data jurusan di sistem KTM Management.

---

## 🚀 Akses Halaman Jurusan

1. Login sebagai admin
2. Lihat sidebar di sebelah kiri
3. Klik menu **"Jurusan"** (icon buku)
4. Anda akan diarahkan ke halaman `/jurusan`

---

## ➕ Menambah Jurusan Baru

### Langkah-langkah:

1. **Klik tombol "Tambah Jurusan"** (tombol biru di kanan atas)
2. **Modal form akan muncul**
3. **Isi nama jurusan**
   - Contoh: "Teknik Informatika"
   - Minimal 3 karakter
   - Maksimal 100 karakter
4. **Klik "Simpan"**
5. **Selesai!** Jurusan baru akan muncul di tabel

### Tips:
- ✅ Gunakan nama lengkap dan jelas
- ✅ Hindari singkatan yang ambigu
- ❌ Jangan gunakan nama yang sudah ada (akan error)

---

## ✏️ Mengedit Jurusan

### Langkah-langkah:

1. **Cari jurusan** yang ingin diedit di tabel
2. **Klik icon pensil** (Edit) di kolom "Aksi"
3. **Modal form akan muncul** dengan data existing
4. **Ubah nama jurusan**
5. **Klik "Perbarui"**
6. **Selesai!** Data jurusan akan diupdate

### Catatan:
- Perubahan nama jurusan akan langsung terlihat di seluruh sistem
- Mahasiswa yang sudah terkait tetap menggunakan jurusan yang sama

---

## 🗑️ Menghapus Jurusan

### Langkah-langkah:

1. **Cari jurusan** yang ingin dihapus
2. **Klik icon tempat sampah** (Delete) di kolom "Aksi"
3. **Konfirmasi penghapusan** di dialog popup
4. **Klik "OK"**
5. **Selesai!** Jurusan akan dihapus

### ⚠️ PENTING:

**Jurusan TIDAK BISA dihapus jika:**
- Masih ada mahasiswa yang terdaftar di jurusan tersebut
- Sistem akan menampilkan error: *"Jurusan tidak dapat dihapus karena masih digunakan oleh mahasiswa"*

**Solusi:**
1. Pindahkan semua mahasiswa ke jurusan lain terlebih dahulu
2. Atau edit data mahasiswa untuk mengubah jurusannya
3. Baru kemudian hapus jurusan

---

## 🔍 Mencari Jurusan

### Cara Menggunakan Search:

1. **Lihat search bar** di bagian atas tabel
2. **Ketik nama jurusan** yang ingin dicari
   - Contoh: "Informatika"
3. **Hasil akan difilter otomatis** saat Anda mengetik
4. **Hapus teks** untuk melihat semua jurusan lagi

### Tips Search:
- Tidak case-sensitive (huruf besar/kecil sama saja)
- Bisa search sebagian kata
- Contoh: ketik "admin" akan menemukan "Administrasi Bisnis"

---

## 📄 Navigasi Pagination

Jika jurusan lebih dari 10, akan muncul pagination di bawah tabel.

### Cara Menggunakan:

- **Tombol "Sebelumnya"**: Ke halaman sebelumnya
- **Tombol angka (1, 2, 3, ...)**: Langsung ke halaman tertentu
- **Tombol "Berikutnya"**: Ke halaman berikutnya

### Info Pagination:
- Menampilkan 10 jurusan per halaman
- Total jurusan ditampilkan di bawah tabel
- Contoh: "Menampilkan 1 sampai 10 dari 25 jurusan"

---

## 📊 Informasi Tabel

### Kolom-kolom di Tabel:

| Kolom | Keterangan |
|-------|------------|
| **No** | Nomor urut |
| **Nama Jurusan** | Nama lengkap jurusan/program studi |
| **Dibuat** | Tanggal jurusan ditambahkan ke sistem |
| **Diperbarui** | Tanggal terakhir jurusan diedit (jika ada) |
| **Aksi** | Tombol Edit & Delete |

---

## ✅ Validasi & Error Messages

### Pesan Error yang Mungkin Muncul:

#### 1. "Nama jurusan wajib diisi"
**Penyebab:** Field nama jurusan kosong  
**Solusi:** Isi nama jurusan sebelum submit

#### 2. "Nama jurusan minimal 3 karakter"
**Penyebab:** Nama terlalu pendek  
**Solusi:** Gunakan nama yang lebih lengkap (min 3 huruf)

#### 3. "Nama jurusan maksimal 100 karakter"
**Penyebab:** Nama terlalu panjang  
**Solusi:** Persingkat nama jurusan

#### 4. "Nama jurusan sudah ada"
**Penyebab:** Jurusan dengan nama yang sama sudah terdaftar  
**Solusi:** Gunakan nama yang berbeda atau edit jurusan existing

#### 5. "Jurusan tidak dapat dihapus karena masih digunakan oleh mahasiswa"
**Penyebab:** Ada mahasiswa yang terdaftar di jurusan tersebut  
**Solusi:** Pindahkan mahasiswa ke jurusan lain dulu

---

## 🎯 Best Practices

### DO ✅

- **Gunakan nama resmi** sesuai akreditasi kampus
- **Konsisten dengan penamaan** (contoh: semua pakai "Teknik" bukan "Tek.")
- **Cek duplikat** sebelum menambah jurusan baru
- **Backup data** sebelum menghapus jurusan
- **Koordinasi dengan bagian akademik** untuk perubahan nama jurusan

### DON'T ❌

- **Jangan gunakan singkatan** yang tidak jelas
- **Jangan hapus jurusan** yang masih aktif digunakan
- **Jangan duplikat** nama jurusan dengan typo berbeda
- **Jangan edit sembarangan** tanpa konfirmasi ke bagian akademik

---

## 🔗 Integrasi dengan Fitur Lain

### Jurusan digunakan di:

1. **Data Mahasiswa**
   - Saat tambah/edit mahasiswa, pilih jurusan dari dropdown
   - Filter mahasiswa berdasarkan jurusan

2. **Generate KTM**
   - Nama jurusan muncul di kartu mahasiswa
   - Format: "Prodi: [Nama Jurusan]"

3. **Dashboard** (Coming Soon)
   - Statistik mahasiswa per jurusan
   - Grafik distribusi jurusan

4. **Verifikasi KTM**
   - Info jurusan ditampilkan saat verifikasi

---

## 📱 Responsive Design

Halaman jurusan dapat diakses dari:

- **Desktop**: Layout penuh dengan sidebar
- **Tablet**: Layout responsif, sidebar collapsible
- **Mobile**: Stack layout, tombol hamburger menu

### Tips Mobile:
- Scroll horizontal untuk melihat semua kolom tabel
- Gunakan search untuk mempercepat pencarian
- Modal form akan full-screen di mobile

---

## 🆘 Troubleshooting

### Problem: Tombol "Tambah Jurusan" tidak muncul

**Solusi:**
1. Pastikan Anda login sebagai admin
2. Refresh halaman (F5)
3. Clear browser cache
4. Logout dan login kembali

---

### Problem: Data jurusan tidak muncul

**Solusi:**
1. Cek koneksi internet
2. Refresh halaman
3. Cek apakah database migration sudah dijalankan
4. Hubungi IT support jika masih error

---

### Problem: Error saat submit form

**Solusi:**
1. Cek pesan error yang muncul
2. Pastikan semua field terisi dengan benar
3. Cek koneksi internet
4. Coba lagi setelah beberapa saat
5. Screenshot error dan laporkan ke IT support

---

### Problem: Jurusan tidak muncul di dropdown mahasiswa

**Solusi:**
1. Pastikan jurusan sudah disimpan dengan benar
2. Refresh halaman mahasiswa
3. Clear browser cache
4. Cek di halaman jurusan apakah data sudah ada

---

## 📞 Bantuan & Support

Jika mengalami kendala:

1. **Cek dokumentasi lengkap**: `/features/jurusan/README.md`
2. **Hubungi IT Support**: support@lp3i-pku.ac.id
3. **Laporkan bug**: Gunakan form feedback di sistem
4. **Training**: Hubungi bagian akademik untuk training tambahan

---

## 📝 Checklist Setup Awal

Untuk admin baru, pastikan:

- [ ] Database migration sudah dijalankan
- [ ] Data jurusan default sudah ada (4 jurusan)
- [ ] Akses admin sudah aktif
- [ ] Sidebar menu "Jurusan" sudah muncul
- [ ] Bisa akses halaman `/jurusan`
- [ ] Bisa tambah, edit, hapus jurusan
- [ ] Search dan pagination berfungsi

---

## 🎓 Data Jurusan Default

Sistem sudah dilengkapi dengan 4 jurusan default:

1. **Hubungan Masyarakat**
2. **Administrasi Bisnis**
3. **Management Informatika**
4. **Komputerisasi Akuntansi**

Anda bisa menambah, mengedit, atau menghapus sesuai kebutuhan kampus.

---

**Terakhir diupdate:** 20 April 2026  
**Versi:** 1.0.0  
**Penulis:** Tim Development KTM Management
