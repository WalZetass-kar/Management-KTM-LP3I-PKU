"use client";

import { useState } from "react";
import { Bell, Database, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function SettingsPanel() {
  const [profileSaved, setProfileSaved] = useState("");
  const [securitySaved, setSecuritySaved] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newStudentAlerts, setNewStudentAlerts] = useState(true);
  const [verificationAlerts, setVerificationAlerts] = useState(false);

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <CardTitle>Profil Admin</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="admin-name" className="text-sm font-medium text-foreground">
                Nama Lengkap
              </label>
              <Input id="admin-name" defaultValue="Admin KTM" />
            </div>
            <div className="space-y-2">
              <label htmlFor="admin-email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input id="admin-email" type="email" defaultValue="admin@politekniklp3i.ac.id" />
            </div>
          </div>
          <Button onClick={() => setProfileSaved("Perubahan profil berhasil disimpan.")}>Simpan Perubahan</Button>
          {profileSaved ? <p className="text-sm text-green-700">{profileSaved}</p> : null}
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <CardTitle>Notifikasi</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between gap-4 rounded-2xl border bg-slate-50 px-4 py-4">
            <div>
              <p className="font-semibold text-foreground">Notifikasi Email</p>
              <p className="text-sm text-muted-foreground">Terima pembaruan operasional melalui email.</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-2xl border bg-slate-50 px-4 py-4">
            <div>
              <p className="font-semibold text-foreground">Peringatan Mahasiswa Baru</p>
              <p className="text-sm text-muted-foreground">Tampilkan notifikasi saat mahasiswa baru ditambahkan.</p>
            </div>
            <Switch checked={newStudentAlerts} onCheckedChange={setNewStudentAlerts} />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-2xl border bg-slate-50 px-4 py-4">
            <div>
              <p className="font-semibold text-foreground">Peringatan Verifikasi</p>
              <p className="text-sm text-muted-foreground">Beritahu admin ketika ada KTM yang perlu ditinjau ulang.</p>
            </div>
            <Switch checked={verificationAlerts} onCheckedChange={setVerificationAlerts} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <CardTitle>Keamanan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="current-password" className="text-sm font-medium text-foreground">
                Kata Sandi Saat Ini
              </label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <label htmlFor="new-password" className="text-sm font-medium text-foreground">
                Kata Sandi Baru
              </label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
                Konfirmasi Kata Sandi
              </label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button onClick={() => setSecuritySaved("Kata sandi berhasil diperbarui.")}>Perbarui Kata Sandi</Button>
            {securitySaved ? <p className="text-sm text-green-700">{securitySaved}</p> : null}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Database className="h-5 w-5" />
              </div>
              <CardTitle>Operasional Sistem</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border bg-slate-50 px-4 py-4">
              <p className="font-semibold text-foreground">Cadangkan Basis Data</p>
              <p className="mt-1 text-sm text-muted-foreground">Cadangan terakhir dilakukan 2 hari yang lalu.</p>
              <Button variant="outline" className="mt-4">
                Cadangkan Sekarang
              </Button>
            </div>
            <div className="rounded-2xl border bg-slate-50 px-4 py-4">
              <p className="font-semibold text-foreground">Ekspor Data Mahasiswa</p>
              <p className="mt-1 text-sm text-muted-foreground">Siapkan file CSV untuk kebutuhan pelaporan atau migrasi data.</p>
              <Button variant="outline" className="mt-4">
                Ekspor CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
