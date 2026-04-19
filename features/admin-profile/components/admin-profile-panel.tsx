"use client";

import { useState } from "react";
import { User, Camera, Mail, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AuthenticatedAdmin } from "@/lib/auth";

interface AdminProfilePanelProps {
  admin: AuthenticatedAdmin;
}

export function AdminProfilePanel({ admin }: AdminProfilePanelProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(admin.profile.photo_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validasi file
    if (!file.type.startsWith("image/")) {
      setMessage("File harus berupa gambar");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Ukuran file maksimal 5MB");
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("file", file);

      // Upload to server
      const response = await fetch("/api/upload-profile-photo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Gagal mengupload foto");
      }

      const data = await response.json();
      setPhotoUrl(data.url);
      setMessage("Foto profil berhasil diupdate");
    } catch (error) {
      setMessage("Gagal mengupload foto. Silakan coba lagi.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid gap-6">
      {/* Profile Photo Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Camera className="h-5 w-5" />
            </div>
            <CardTitle>Foto Profil</CardTitle>
          </div>
          <CardDescription>
            Upload foto profil Anda. Ukuran maksimal 5MB.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-border bg-muted">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                    <User className="h-12 w-12" />
                  </div>
                )}
              </div>
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                <Camera className="h-4 w-4" />
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                  disabled={isUploading}
                />
              </label>
            </div>
            <div>
              <p className="text-sm font-medium">
                {admin.profile.username}
              </p>
              <p className="text-sm text-muted-foreground">
                {admin.user.email}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Klik icon kamera untuk mengubah foto
              </p>
            </div>
          </div>
          {message && (
            <p className={`text-sm ${message.includes("berhasil") ? "text-green-600" : "text-destructive"}`}>
              {message}
            </p>
          )}
          {isUploading && (
            <p className="text-sm text-muted-foreground">
              Mengupload foto...
            </p>
          )}
        </CardContent>
      </Card>

      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <CardTitle>Informasi Profil</CardTitle>
          </div>
          <CardDescription>
            Informasi dasar akun admin Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Username
              </label>
              <Input
                value={admin.profile.username}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Role
              </label>
              <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3">
                <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm capitalize">{admin.profile.role}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Email
            </label>
            <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3">
              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{admin.user.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <CardTitle>Informasi Akun</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">User ID</dt>
              <dd className="font-mono text-xs">{admin.user.id}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Dibuat</dt>
              <dd>
                {new Date(admin.user.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Terakhir Login</dt>
              <dd>
                {admin.user.last_sign_in_at
                  ? new Date(admin.user.last_sign_in_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
