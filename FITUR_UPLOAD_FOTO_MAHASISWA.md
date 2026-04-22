# Fitur Upload Foto Mahasiswa Angkatan

## 🎯 **Fitur Baru yang Ditambahkan**

### 1. **Upload Foto di Form Tambah Mahasiswa**
- ✅ **Preview foto**: Menampilkan preview foto yang dipilih
- ✅ **Validasi file**: Hanya menerima gambar (JPG, PNG, WEBP)
- ✅ **Validasi ukuran**: Maksimal 2MB per file
- ✅ **Remove foto**: Tombol untuk menghapus foto yang sudah dipilih
- ✅ **UI yang intuitif**: Drag & drop area dengan instruksi yang jelas

### 2. **API Upload Foto**
- ✅ **Endpoint baru**: `/api/upload-student-photo`
- ✅ **Supabase Storage**: Upload ke bucket `student-photos`
- ✅ **Unique filename**: Mencegah konflik nama file
- ✅ **Error handling**: Validasi dan error response yang proper

### 3. **Database Integration**
- ✅ **Photo URL**: Menyimpan URL foto di kolom `photo_url`
- ✅ **Optional field**: Foto tidak wajib diisi
- ✅ **Public access**: Foto dapat diakses secara publik

## 🔧 **Technical Implementation**

### 1. **Form Component Updates**
```typescript
// State management untuk foto
const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);
const [photoFile, setPhotoFile] = useState<File | null>(null);

// Upload handler dengan validasi
const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  // Validasi file type dan size
  // Set preview dan file state
}
```

### 2. **API Route**
```typescript
// /api/upload-student-photo/route.ts
- Validasi file type (image/*)
- Validasi file size (max 2MB)
- Upload ke Supabase Storage
- Return public URL
```

### 3. **Database Schema**
```sql
-- Kolom photo_url sudah ada di tabel mahasiswa_angkatan
photo_url TEXT, -- URL foto mahasiswa
```

### 4. **Storage Bucket**
```sql
-- Bucket: student-photos
- Public read access
- Authenticated upload/update/delete
- File size limit: 2MB
- Allowed types: JPG, PNG, WEBP
```

## 🎨 **UI/UX Features**

### 1. **Photo Upload Area**
- **Empty state**: Placeholder dengan icon upload
- **Preview state**: Menampilkan foto dengan tombol remove
- **Instructions**: Panduan ukuran dan format file
- **Upload button**: Styled button untuk memilih file

### 2. **Validation Messages**
- **File type error**: "File harus berupa gambar (JPG, PNG, WEBP)"
- **File size error**: "Ukuran file maksimal 2MB"
- **Upload error**: Fallback jika upload gagal

### 3. **Loading States**
- **Form submission**: Button disabled dengan loading text
- **Photo upload**: Integrated dengan form submission

## 📋 **Workflow**

### 1. **Upload Process**
```
1. User pilih foto → Validasi client-side
2. Preview foto → Set ke state
3. Submit form → Upload foto ke API
4. API upload → Supabase Storage
5. Get public URL → Save ke database
6. Redirect → Halaman mahasiswa angkatan
```

### 2. **Error Handling**
```
1. File validation error → Alert message
2. Upload API error → Continue without photo
3. Database error → Show error message
4. Network error → Retry mechanism
```

## 🔒 **Security & Validation**

### 1. **Client-side Validation**
- ✅ File type check (image/*)
- ✅ File size check (max 2MB)
- ✅ Preview generation
- ✅ User feedback

### 2. **Server-side Validation**
- ✅ File type validation
- ✅ File size validation
- ✅ Unique filename generation
- ✅ Error handling

### 3. **Storage Security**
- ✅ RLS policies untuk bucket
- ✅ Public read access
- ✅ Authenticated write access
- ✅ File size limits

## 🚀 **Setup Instructions**

### 1. **Database Setup**
```sql
-- Tabel mahasiswa_angkatan sudah memiliki kolom photo_url
-- Tidak perlu perubahan schema
```

### 2. **Storage Setup**
```sql
-- Jalankan script: supabase/create-storage-bucket.sql
-- Membuat bucket student-photos dengan policies
```

### 3. **Environment Variables**
```env
# Sudah ada di .env.local
NEXT_PUBLIC_SUPABASE_URL=https://bmxvtnlkneyrpnfyxkqg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 📊 **File Structure**

### 1. **New Files**
- `app/api/upload-student-photo/route.ts` - API endpoint untuk upload
- `supabase/create-storage-bucket.sql` - Script setup storage

### 2. **Modified Files**
- `features/mahasiswa-angkatan/components/mahasiswa-angkatan-form.tsx` - UI upload
- `types/mahasiswa-angkatan.ts` - Tambah photoUrl field
- `actions/mahasiswa-angkatan.ts` - Handle photoUrl di database

## 🎯 **Benefits**

### 1. **User Experience**
- ✅ **Visual feedback**: Preview foto sebelum submit
- ✅ **Clear instructions**: Panduan format dan ukuran
- ✅ **Error handling**: Pesan error yang informatif
- ✅ **Responsive design**: Works di desktop dan mobile

### 2. **Data Quality**
- ✅ **Consistent format**: Validasi file type
- ✅ **Optimized size**: Limit 2MB untuk performa
- ✅ **Unique storage**: Tidak ada konflik filename
- ✅ **Public access**: Foto dapat digunakan di KTM

### 3. **System Integration**
- ✅ **Seamless workflow**: Terintegrasi dengan form existing
- ✅ **Storage management**: Menggunakan Supabase Storage
- ✅ **Database consistency**: URL tersimpan dengan benar
- ✅ **Error resilience**: Tetap bisa submit tanpa foto

## 🧪 **Testing Checklist**

### 1. **Upload Functionality**
- [ ] Upload foto JPG berhasil
- [ ] Upload foto PNG berhasil
- [ ] Upload foto WEBP berhasil
- [ ] Reject file non-image
- [ ] Reject file > 2MB
- [ ] Preview foto muncul dengan benar

### 2. **Form Integration**
- [ ] Submit form dengan foto berhasil
- [ ] Submit form tanpa foto berhasil
- [ ] Remove foto berfungsi
- [ ] Ganti foto berfungsi
- [ ] Loading state saat submit

### 3. **Database & Storage**
- [ ] Foto tersimpan di Supabase Storage
- [ ] URL tersimpan di database
- [ ] Foto dapat diakses via public URL
- [ ] RLS policies berfungsi

## 🔮 **Future Enhancements**

### 1. **Image Processing**
- Auto-resize foto untuk konsistensi
- Compress foto untuk menghemat storage
- Crop foto ke aspect ratio yang tepat

### 2. **Advanced Features**
- Drag & drop upload
- Multiple foto upload
- Batch upload untuk import data
- Image editing tools

### 3. **Integration**
- Tampilkan foto di tabel mahasiswa angkatan
- Gunakan foto di generate KTM
- Export foto untuk keperluan lain

## 📝 **Notes**

- Foto bersifat optional, form tetap bisa disubmit tanpa foto
- API endpoint terpisah dari upload profile photo admin
- Storage bucket khusus untuk foto mahasiswa
- Public access untuk memudahkan penggunaan di KTM
- Error handling yang graceful jika upload gagal