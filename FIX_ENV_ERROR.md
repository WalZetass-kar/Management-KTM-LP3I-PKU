# Fix: Missing Supabase Environment Variable Error

## Error Message
```
Missing required Supabase environment variable: NEXT_PUBLIC_SUPABASE_URL
```

## Penyebab
Next.js development server belum reload setelah perubahan code, atau environment variables tidak terbaca dengan benar.

## Solusi

### Step 1: Stop Development Server
Tekan `Ctrl + C` di terminal untuk stop server.

### Step 2: Verify .env.local File
Pastikan file `.env.local` ada dan berisi:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bmxvtnlkneyrpnfyxkqg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Clear Next.js Cache
```bash
rm -rf .next
```

### Step 4: Restart Development Server
```bash
npm run dev
```

### Step 5: Hard Refresh Browser
Setelah server running:
1. Buka aplikasi di browser
2. Tekan `Ctrl + Shift + R` (Windows/Linux) atau `Cmd + Shift + R` (Mac)
3. Atau clear browser cache

---

## Alternative: Quick Restart

Jika masih error, coba ini:

```bash
# Stop server (Ctrl + C)
# Then run:
rm -rf .next
npm run dev
```

Tunggu sampai server fully started, lalu refresh browser.

---

## Verify Environment Variables

Untuk memastikan env vars terbaca, tambahkan ini di browser console:

```javascript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
```

Jika undefined, berarti env vars tidak terbaca.

---

## Common Issues

### Issue 1: .env.local tidak terbaca
**Solution**: Pastikan file ada di root project (sejajar dengan package.json)

### Issue 2: Server tidak restart setelah perubahan
**Solution**: Stop server (Ctrl+C) dan start lagi (npm run dev)

### Issue 3: Browser cache
**Solution**: Hard refresh (Ctrl+Shift+R) atau clear cache

---

## After Fix

Setelah server restart dan browser refresh:
1. Error harus hilang
2. Aplikasi bisa load normal
3. Login harus berfungsi
4. RBAC harus berfungsi (admin lihat 5 menu)

---

## Next Steps

Setelah error ini fix, lanjutkan dengan:
1. Jalankan SQL fix role: `supabase/fix-role-case-sensitive.sql`
2. Logout dan login lagi
3. Verify RBAC berfungsi (admin hanya lihat 5 menu)
