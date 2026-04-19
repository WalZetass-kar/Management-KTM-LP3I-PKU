# 🎓 KTM Flip Card - Quick Guide

## 🚀 Setup (2 menit)

```bash
# 1. Install dependencies
npm install html2canvas jspdf lucide-react

# 2. Restart server
npm run dev

# 3. Buka generator
# http://localhost:3000/generate-ktm-v3
```

## 📦 Files

```
components/ui/
└── ktm-card-flip.tsx              (15KB) - Main component

features/ktm/components/
├── ktm-generator-flip.tsx         (8.9KB) - With download
└── ktm-generator-v3.tsx           (7.6KB) - Full page

app/generate-ktm-v3/
└── page.tsx                       - Generator page
```

## 💻 Usage

### Basic
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

### With Download
```tsx
import { KTMGeneratorFlip } from "@/features/ktm/components/ktm-generator-flip";

<KTMGeneratorFlip mahasiswa={data} />
```

### Full Page
```tsx
import { KtmGeneratorV3 } from "@/features/ktm/components/ktm-generator-v3";

<KtmGeneratorV3 students={data} />
```

## 🎨 Features

✅ Flip animation (depan & belakang)
✅ Download PNG & PDF
✅ QR Code auto-generate
✅ Responsive design
✅ Warna biru azure & putih

## 📖 Docs

Lihat [KTM_README.md](KTM_README.md) untuk detail lengkap.

---
**Total**: 5 files | **Size**: ~32KB | **Status**: Production Ready
