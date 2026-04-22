# Fitur Generate KTM dengan Filter Angkatan

## 🎯 **Fitur Baru yang Ditambahkan**

### 1. **Filter Sumber Data**
- **Mahasiswa Angkatan**: Data terbaru dari tabel `mahasiswa_angkatan`
- **Data Mahasiswa Lama**: Fallback ke tabel `mahasiswa` yang sudah ada

### 2. **Filter Berdasarkan Angkatan**
- Dropdown untuk memilih angkatan (2023, 2024, 2025, 2026, 2027)
- Otomatis menampilkan jumlah mahasiswa yang tersedia
- URL parameter untuk bookmark dan sharing

### 3. **Informasi Mahasiswa yang Diperkaya**
- Menampilkan informasi angkatan di detail mahasiswa
- Label yang jelas untuk membedakan sumber data
- Status dan informasi lengkap mahasiswa

## 🔧 **Cara Menggunakan**

### 1. **Akses Halaman Generate KTM**
- Buka menu "Generate KTM" di sidebar
- Halaman akan otomatis load dengan data mahasiswa angkatan

### 2. **Pilih Sumber Data**
- **Mahasiswa Angkatan**: Untuk data terbaru dengan sistem angkatan
- **Data Mahasiswa Lama**: Untuk kompatibilitas dengan data lama

### 3. **Filter Berdasarkan Angkatan**
- Pilih angkatan dari dropdown (hanya muncul jika sumber = "Mahasiswa Angkatan")
- Sistem akan otomatis reload dengan data angkatan yang dipilih
- Jumlah mahasiswa tersedia ditampilkan secara real-time

### 4. **Generate KTM**
- Pilih mahasiswa dari dropdown
- Preview KTM akan muncul dengan informasi lengkap termasuk angkatan
- Download dalam format PNG atau PDF

## 📊 **URL Parameters**

### Query Parameters yang Didukung:
- `angkatan`: Tahun angkatan (2023-2027)
- `source`: Sumber data ("angkatan" atau "mahasiswa")

### Contoh URL:
```
/generate-ktm?source=angkatan&angkatan=2025
/generate-ktm?source=mahasiswa
```

## 🎨 **Tampilan UI**

### 1. **Filter Section (Baru)**
- Card dengan filter sumber data dan angkatan
- Counter jumlah mahasiswa tersedia
- Design yang konsisten dengan tema aplikasi

### 2. **Student Selection**
- Label yang menunjukkan angkatan yang dipilih
- Placeholder text yang informatif
- Dropdown dengan format: "Nama — NIM — Jurusan"

### 3. **Student Info Panel**
- Menampilkan informasi angkatan (jika menggunakan sumber angkatan)
- Status badge dengan warna yang sesuai
- Layout yang rapi dan mudah dibaca

### 4. **Empty State**
- Pesan yang berbeda berdasarkan sumber data
- Informasi yang jelas tentang cara menambah data

## 🔄 **Alur Kerja**

### 1. **Load Halaman**
```
1. Cek query parameters (source, angkatan)
2. Load data berdasarkan sumber yang dipilih
3. Tampilkan filter dan data mahasiswa
```

### 2. **Ganti Sumber Data**
```
1. User pilih sumber data baru
2. Redirect dengan parameter yang sesuai
3. Load data dari tabel yang tepat
```

### 3. **Ganti Angkatan**
```
1. User pilih angkatan baru
2. Redirect dengan parameter angkatan
3. Load mahasiswa untuk angkatan tersebut
```

## 🛠 **Technical Implementation**

### 1. **File yang Dimodifikasi**
- `app/generate-ktm/page.tsx`: Server component dengan query params
- `features/ktm/components/ktm-generator-modern.tsx`: UI component dengan filter

### 2. **Data Flow**
```
Page Component (Server)
├── Get query parameters
├── Load data based on source
├── Pass data to client component
└── Client Component (Browser)
    ├── Display filters
    ├── Handle filter changes
    └── Generate KTM
```

### 3. **Data Mapping**
```typescript
// Convert mahasiswa_angkatan to StudentRecord format
mahasiswaAngkatan → StudentRecord {
  fullName: student.fullName,
  nim: student.nim,
  studyProgram: student.studyProgram,
  // ... other fields
}
```

## 🎯 **Benefits**

### 1. **User Experience**
- ✅ Filter yang intuitif dan mudah digunakan
- ✅ Informasi yang jelas tentang sumber data
- ✅ URL yang dapat di-bookmark
- ✅ Loading state yang informatif

### 2. **Data Management**
- ✅ Support untuk sistem angkatan baru
- ✅ Backward compatibility dengan data lama
- ✅ Flexible data source switching

### 3. **Performance**
- ✅ Server-side filtering untuk performa optimal
- ✅ Minimal client-side JavaScript
- ✅ Efficient data loading

## 🧪 **Testing**

### 1. **Test Scenarios**
- [ ] Load halaman dengan default parameters
- [ ] Ganti sumber data dari angkatan ke mahasiswa
- [ ] Ganti angkatan dan verify data update
- [ ] Generate KTM dengan data angkatan
- [ ] Test dengan data kosong
- [ ] Test dengan error state

### 2. **Browser Compatibility**
- [ ] Chrome/Edge (modern)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

## 🚀 **Future Enhancements**

### 1. **Possible Improvements**
- Search/filter mahasiswa dalam angkatan
- Bulk generate KTM untuk seluruh angkatan
- Export data mahasiswa per angkatan
- Statistics per angkatan

### 2. **Advanced Features**
- Template KTM yang berbeda per angkatan
- Batch processing untuk generate multiple KTM
- Integration dengan sistem akademik

## 📝 **Notes**

- Fitur ini fully backward compatible dengan sistem lama
- Default menggunakan sumber "angkatan" untuk data terbaru
- Fallback otomatis jika tabel mahasiswa_angkatan tidak tersedia
- URL parameters memungkinkan deep linking dan bookmarking