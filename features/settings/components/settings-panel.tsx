"use client";

import { useState } from "react";
import { Database, Shield, Lock, Key, Server, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function SettingsPanel() {
  const [securitySaved, setSecuritySaved] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);

  const handleChangePassword = () => {
    setSecuritySaved("Kata sandi berhasil diperbarui.");
    setTimeout(() => setSecuritySaved(""), 3000);
  };

  const handleBackupNow = () => {
    alert("Backup database sedang diproses...");
  };

  const handleExportData = () => {
    alert("Export data mahasiswa sedang diproses...");
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      {/* Security Settings */}
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Keamanan Akun</CardTitle>
              <CardDescription>Kelola keamanan dan autentikasi akun admin</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="current-password" className="text-sm font-medium text-foreground">
              Kata Sandi Saat Ini
            </label>
            <Input id="current-password" type="password" placeholder="Masukkan kata sandi saat ini" />
          </div>
          <div className="space-y-2">
            <label htmlFor="new-password" className="text-sm font-medium text-foreground">
              Kata Sandi Baru
            </label>
            <Input id="new-password" type="password" placeholder="Minimal 8 karakter" />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
              Konfirmasi Kata Sandi Baru
            </label>
            <Input id="confirm-password" type="password" placeholder="Ulangi kata sandi baru" />
          </div>
          <Button onClick={handleChangePassword} className="w-full sm:w-auto">
            <Lock className="mr-2 h-4 w-4" />
            Perbarui Kata Sandi
          </Button>
          {securitySaved && <p className="text-sm text-green-600">{securitySaved}</p>}
        </CardContent>
      </Card>

      {/* Security Options */}
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Opsi Keamanan</CardTitle>
              <CardDescription>Konfigurasi pengaturan keamanan tambahan</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4 rounded-lg border bg-slate-50 px-4 py-4">
            <div className="flex-1">
              <p className="font-semibold text-foreground">Autentikasi Dua Faktor (2FA)</p>
              <p className="text-sm text-muted-foreground">
                Tambahkan lapisan keamanan ekstra dengan kode verifikasi
              </p>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-lg border bg-slate-50 px-4 py-4">
            <div className="flex-1">
              <p className="font-semibold text-foreground">Session Timeout Otomatis</p>
              <p className="text-sm text-muted-foreground">
                Logout otomatis setelah 30 menit tidak aktif
              </p>
            </div>
            <Switch checked={sessionTimeout} onCheckedChange={setSessionTimeout} />
          </div>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
            <p className="text-sm font-medium text-yellow-800">
              ⚠️ Perubahan pengaturan keamanan akan diterapkan pada sesi login berikutnya
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Operations */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Backup Database</CardTitle>
                <CardDescription>Cadangkan data sistem secara berkala</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-lg border bg-slate-50 px-4 py-4">
              <div className="flex-1">
                <p className="font-semibold text-foreground">Backup Otomatis</p>
                <p className="text-sm text-muted-foreground">Backup harian pada pukul 02:00 WIB</p>
              </div>
              <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
            </div>
            <div className="space-y-3">
              <div className="rounded-lg bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Backup Terakhir</span>
                  <span className="text-sm text-muted-foreground">2 hari yang lalu</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Ukuran Database</span>
                  <span className="text-sm text-muted-foreground">45.2 MB</span>
                </div>
              </div>
              <Button onClick={handleBackupNow} variant="outline" className="w-full">
                <HardDrive className="mr-2 h-4 w-4" />
                Backup Sekarang
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Operasional Sistem</CardTitle>
                <CardDescription>Kelola data dan operasional sistem</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="rounded-lg bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Total Mahasiswa</span>
                  <span className="text-sm font-semibold text-foreground">1,234</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">KTM Digenerate</span>
                  <span className="text-sm font-semibold text-foreground">987</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Status Sistem</span>
                  <span className="text-sm font-semibold text-green-600">● Online</span>
                </div>
              </div>
              <Button onClick={handleExportData} variant="outline" className="w-full">
                <Database className="mr-2 h-4 w-4" />
                Ekspor Data Mahasiswa (CSV)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Informasi Sistem</CardTitle>
              <CardDescription>Detail teknis dan versi sistem</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-slate-50 px-4 py-3">
              <p className="text-xs text-muted-foreground">Versi Sistem</p>
              <p className="mt-1 font-semibold text-foreground">v1.0.0</p>
            </div>
            <div className="rounded-lg border bg-slate-50 px-4 py-3">
              <p className="text-xs text-muted-foreground">Database</p>
              <p className="mt-1 font-semibold text-foreground">PostgreSQL 15</p>
            </div>
            <div className="rounded-lg border bg-slate-50 px-4 py-3">
              <p className="text-xs text-muted-foreground">Storage</p>
              <p className="mt-1 font-semibold text-foreground">Supabase</p>
            </div>
            <div className="rounded-lg border bg-slate-50 px-4 py-3">
              <p className="text-xs text-muted-foreground">Framework</p>
              <p className="mt-1 font-semibold text-foreground">Next.js 15</p>
            </div>
            <div className="rounded-lg border bg-slate-50 px-4 py-3">
              <p className="text-xs text-muted-foreground">Uptime</p>
              <p className="mt-1 font-semibold text-foreground">99.9%</p>
            </div>
            <div className="rounded-lg border bg-slate-50 px-4 py-3">
              <p className="text-xs text-muted-foreground">Last Update</p>
              <p className="mt-1 font-semibold text-foreground">17 Apr 2026</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
