# 🎓 KTM Flip Card - Kartu Tanda Mahasiswa Modern

Sistem pembuatan Kartu Tanda Mahasiswa dengan desain modern dan fitur flip animation (depan & belakang).

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install html2canvas jspdf lucide-react
```

### 2. Restart Server
```bash
npm run dev
```

### 3. Akses Generator
```
http://localhost:3000/generate-ktm-v3
```

## 📦 Komponen

### 1. KTMCardFlip (Main Component)
**File**: `components/ui/ktm-card-flip.tsx`

```tsx
import { KTMCardFlip } from "@/components/ui/ktm-card-flip";

<KTMCardFlip
  nama="BUDI SANTOSO"
  nim="2024010101"
  jurusan="TEKNIK INFORMATIKA"
  masaBerlaku="2024 - 2028"
  fotoUrl="/photo.jpg"
/>
```

### 2. KTMGeneratorFlip (With Download)
**File**: `features/ktm/components/ktm-generator-flip.tsx`

```tsx
import { KTMGeneratorFlip } from "@/features/ktm/components/ktm-generator-flip";

<KTMGeneratorFlip mahasiswa={mahasiswaData} />
```

### 3. KtmGeneratorV3 (Full Page)
**File**: `features/ktm/components/ktm-generator-v3.tsx`

```tsx
import { KtmGeneratorV3 } from "@/features/ktm/components/ktm-generator-v3";

<KtmGeneratorV3 students={studentsData} />
```

## 🎨 Fitur

✅ **Flip Animation** - 3D transform smooth (700ms)
✅ **2 Sisi Kartu** - Depan (data) & Belakang (info)
✅ **Download PNG** - Per sisi atau keduanya
✅ **Download PDF** - 2 halaman landscape
✅ **QR Code** - Auto-generate untuk verifikasi
✅ **Responsive** - Mobile, tablet, desktop
✅ **Warna LP3I** - Biru azure & putih

## 📋 Props

### Required
- `nama`: string - Nama lengkap
- `nim`: string - Nomor Induk
- `jurusan`: string - Program studi
- `masaBerlaku`: string - Format "YYYY - YYYY"
- `fotoUrl`: string | null - URL foto

### Optional
- `fakultas`: string
- `logoUrl`: string (default: "/images/logo-lp3i.png")
- `namaKampus`: string (default: "POLITEKNIK LP3I...")
- `alamat`: string
- `email`: string
- `website`: string
- `telepon`: string
- `qrUrl`: string
- `autoFlip`: boolean (default: false)

## 🎯 Mode Flip

### Manual (Click)
```tsx
<KTMCardFlip {...props} autoFlip={false} />
```

### Auto (Hover)
```tsx
<KTMCardFlip {...props} autoFlip={true} />
```

## 🔧 Customization

### Generate QR Code
```tsx
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${nim}`;
```

### Change Colors
Edit `ktm-card-flip.tsx` line ~200:
```tsx
from-[#1e3a8a] via-[#1e40af] to-[#2563eb]
```

## 🐛 Troubleshooting

### Foto tidak muncul
```js
// next.config.js
module.exports = {
  images: {
    domains: ['your-domain.com'],
  },
}
```

### Download tidak berfungsi
```bash
npm install html2canvas jspdf
```

## 📄 Pages

- **Generator**: `/generate-ktm-v3` - Production page dengan selection & download

## ✅ Status

**Production Ready** - Tested & optimized

---

**Version**: 1.0.0 | **License**: MIT
