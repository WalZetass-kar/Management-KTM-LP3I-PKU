# 🔔 Fitur Notifikasi Bell - Dokumentasi

## Overview
Icon lonceng (bell) di topbar sekarang berfungsi! Menampilkan jumlah mahasiswa yang menunggu verifikasi dan bisa diklik untuk melihat detail atau langsung ke halaman verifikasi.

## Features

### 1. Badge Count
- ✅ **Angka merah** di pojok kanan atas bell
- ✅ Menampilkan jumlah mahasiswa menunggu (1-9, atau "9+" jika lebih dari 9)
- ✅ **Animasi pulse** pada dot merah untuk menarik perhatian
- ✅ Auto-hide jika tidak ada notifikasi

### 2. Dropdown Notifikasi
- ✅ **Klik bell** → Dropdown muncul
- ✅ **Header**: Jumlah mahasiswa menunggu
- ✅ **Content**: 
  - Jika ada pending → Card dengan info dan link ke `/verifikasi`
  - Jika tidak ada → Empty state "Semua Selesai!"
- ✅ **Auto-close** saat klik di luar dropdown

### 3. Real-time Update
- ✅ **Auto-refresh** setiap 30 detik
- ✅ **API endpoint** `/api/pending-count` untuk fetch count
- ✅ **Hook** `usePendingCount()` untuk manage state

## UI Design

### Bell Icon dengan Badge:
```
     🔔
    ┌─┐
    │●│ ← Dot merah (pulse animation)
    └─┘
     3  ← Badge count (angka merah)
```

### Dropdown (Ada Notifikasi):
```
┌────────────────────────────────────┐
│ Notifikasi                         │
│ 3 mahasiswa menunggu verifikasi    │
├────────────────────────────────────┤
│ ⏰  Verifikasi Mahasiswa           │
│     3 mahasiswa baru menunggu      │
│     untuk diverifikasi             │
│     Klik untuk review →            │
└────────────────────────────────────┘
```

### Dropdown (Tidak Ada Notifikasi):
```
┌────────────────────────────────────┐
│ Notifikasi                         │
│ Tidak ada notifikasi baru          │
├────────────────────────────────────┤
│         ✓                          │
│    Semua Selesai!                  │
│    Tidak ada mahasiswa yang        │
│    menunggu verifikasi             │
└────────────────────────────────────┘
```

## Implementation

### 1. Dashboard Topbar
**File**: `components/layout/dashboard-topbar.tsx`

#### Props:
```typescript
interface DashboardTopbarProps {
  onOpenSidebar: () => void;
  userProfile?: {
    username: string;
    role: "admin" | "super_admin";
  } | null;
  pendingCount?: number;  // ← New prop
}
```

#### Features:
- State `isNotificationOpen` untuk toggle dropdown
- Badge count dengan conditional rendering
- Dropdown dengan Link ke `/verifikasi`
- Empty state untuk no notifications

### 2. Dashboard Layout
**File**: `components/layout/dashboard-layout.tsx`

#### Changes:
```typescript
import { usePendingCount } from "@/hooks/use-pending-count";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { pendingCount } = usePendingCount();  // ← Fetch count
  
  return (
    <DashboardTopbar 
      pendingCount={pendingCount}  // ← Pass to topbar
      // ...
    />
  );
}
```

### 3. Pending Count Hook
**File**: `hooks/use-pending-count.ts`

#### Features:
- Fetch count dari API `/api/pending-count`
- Auto-refresh setiap 30 detik
- Error handling
- Cleanup interval on unmount

```typescript
export function usePendingCount() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    async function fetchPendingCount() {
      const response = await fetch("/api/pending-count");
      const data = await response.json();
      setPendingCount(data.count || 0);
    }

    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 30000);  // 30s
    return () => clearInterval(interval);
  }, []);

  return { pendingCount };
}
```

### 4. API Endpoint
**File**: `app/api/pending-count/route.ts`

#### Features:
- Query count dari tabel `mahasiswa` dengan status "Menunggu"
- Return JSON `{ count: number }`
- Error handling dengan fallback count = 0

```typescript
export async function GET() {
  const { count } = await supabase
    .from("mahasiswa")
    .select("*", { count: "exact", head: true })
    .eq("status", "Menunggu");

  return NextResponse.json({ count: count || 0 });
}
```

## User Flow

### Scenario 1: Ada Mahasiswa Menunggu
```
1. Admin login
2. Bell icon menampilkan badge "3" dengan dot merah pulse
3. Admin klik bell
4. Dropdown muncul: "3 mahasiswa menunggu verifikasi"
5. Admin klik "Klik untuk review →"
6. Redirect ke /verifikasi
7. Admin verifikasi mahasiswa
8. Badge count berkurang otomatis (auto-refresh 30s)
```

### Scenario 2: Tidak Ada Mahasiswa Menunggu
```
1. Admin login
2. Bell icon tanpa badge (bersih)
3. Admin klik bell
4. Dropdown muncul: "Semua Selesai!" dengan icon ✓
5. Admin tutup dropdown
```

### Scenario 3: Real-time Update
```
1. Admin A di dashboard (count: 3)
2. Admin B verifikasi 1 mahasiswa
3. Setelah max 30 detik
4. Admin A melihat count berubah jadi 2 (auto-refresh)
```

## Styling

### Badge Count:
```css
- Position: absolute -right-1 -top-1
- Size: h-5 w-5
- Background: bg-destructive (merah)
- Text: text-[10px] font-bold text-white
- Display: "9+" jika count > 9
```

### Pulse Dot:
```css
- Position: absolute right-2 top-2
- Size: h-2.5 w-2.5
- Background: bg-destructive
- Animation: animate-pulse
```

### Dropdown:
```css
- Width: w-80
- Position: absolute right-0 mt-3
- Border: rounded-2xl border
- Shadow: shadow-lg
- Max height: max-h-96 overflow-y-auto
```

## Testing

### Test 1: Badge Count
1. Tambah 3 mahasiswa baru (status: Menunggu)
2. **Expected**: Bell menampilkan badge "3" ✅
3. **Expected**: Dot merah pulse ✅

### Test 2: Dropdown Open/Close
1. Klik bell icon
2. **Expected**: Dropdown muncul ✅
3. Klik di luar dropdown
4. **Expected**: Dropdown tutup ✅

### Test 3: Link ke Verifikasi
1. Klik bell → Dropdown muncul
2. Klik "Klik untuk review →"
3. **Expected**: Redirect ke `/verifikasi` ✅
4. **Expected**: Dropdown tutup ✅

### Test 4: Empty State
1. Verifikasi semua mahasiswa
2. Klik bell
3. **Expected**: "Semua Selesai!" dengan icon ✓ ✅
4. **Expected**: Tidak ada badge di bell ✅

### Test 5: Auto-refresh
1. Buka dashboard (count: 3)
2. Di tab lain, verifikasi 1 mahasiswa
3. Tunggu max 30 detik
4. **Expected**: Count berubah jadi 2 ✅

### Test 6: Badge Display
1. Tambah 5 mahasiswa → Badge: "5" ✅
2. Tambah 10 mahasiswa → Badge: "9+" ✅
3. Verifikasi semua → Badge hilang ✅

## Performance

### Optimization:
- ✅ **Debounce**: Auto-refresh setiap 30s (tidak terlalu sering)
- ✅ **Head-only query**: `{ count: "exact", head: true }` (tidak fetch data)
- ✅ **Cleanup**: Clear interval on unmount
- ✅ **Error handling**: Fallback count = 0 jika error

### Network:
- **Initial load**: 1 request ke `/api/pending-count`
- **Auto-refresh**: 1 request setiap 30 detik
- **Payload**: ~20 bytes `{ "count": 3 }`

## Customization

### Ubah Interval Auto-refresh:
**File**: `hooks/use-pending-count.ts`
```typescript
const interval = setInterval(fetchPendingCount, 60000);  // 60s = 1 menit
```

### Ubah Badge Threshold:
**File**: `components/layout/dashboard-topbar.tsx`
```typescript
{pendingCount > 99 ? "99+" : pendingCount}  // Threshold 99
```

### Tambah Notifikasi Lain:
**File**: `components/layout/dashboard-topbar.tsx`
```typescript
// Tambah notifikasi untuk mahasiswa cuti, dll
<Link href="/mahasiswa?status=Cuti">
  <div>Mahasiswa Cuti: {cutiCount}</div>
</Link>
```

## Future Enhancements

### Possible Features:
1. **Multiple Notification Types**:
   - Mahasiswa menunggu verifikasi
   - Mahasiswa cuti
   - KTM expired
   - System updates

2. **Mark as Read**:
   - Track notifikasi yang sudah dibaca
   - Badge hanya untuk unread

3. **Push Notifications**:
   - Browser notification API
   - Sound alert

4. **Notification History**:
   - List semua notifikasi
   - Filter by type/date

5. **Real-time Updates**:
   - WebSocket atau Server-Sent Events
   - Instant update tanpa polling

## Files Created/Modified

### Created:
1. ✅ `hooks/use-pending-count.ts` - Hook untuk fetch count
2. ✅ `app/api/pending-count/route.ts` - API endpoint

### Modified:
1. ✅ `components/layout/dashboard-topbar.tsx` - Bell icon + dropdown
2. ✅ `components/layout/dashboard-layout.tsx` - Pass pendingCount prop

## Kesimpulan

Icon lonceng sekarang berfungsi dengan fitur:
- ✅ **Badge count** yang informatif
- ✅ **Dropdown** dengan detail notifikasi
- ✅ **Link langsung** ke halaman verifikasi
- ✅ **Auto-refresh** setiap 30 detik
- ✅ **Empty state** yang friendly

**Notifikasi sekarang membantu admin untuk tidak melewatkan mahasiswa yang perlu diverifikasi!** 🔔
