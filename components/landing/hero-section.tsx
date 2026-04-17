"use client";

import { useState, useTransition } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KtmPreviewCard } from "@/components/landing/ktm-preview-card";
import { getMahasiswaByNim } from "@/actions/public";

interface MahasiswaData {
  id: number;
  nama: string;
  nim: string;
  jurusan: string;
  alamat: string;
  no_hp: string;
  foto_url: string | null;
  status: string;
  created_at: string;
}

export function HeroSection() {
  const [nim, setNim] = useState("");
  const [mahasiswa, setMahasiswa] = useState<MahasiswaData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    if (!nim.trim()) {
      setError("Masukkan NIM terlebih dahulu");
      return;
    }

    setError(null);
    setMahasiswa(null);

    startTransition(async () => {
      const result = await getMahasiswaByNim(nim);

      if (result.error) {
        setError(result.error);
      } else {
        setMahasiswa(result.data);
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Sistem Pembuatan Kartu Tanda Mahasiswa
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100 sm:text-xl">
            Buat dan verifikasi kartu mahasiswa dengan cepat dan mudah
          </p>

          {/* NIM Search */}
          <div className="mx-auto mt-12 max-w-2xl">
            <div className="rounded-3xl bg-white p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-gray-900">
                Cari Data Mahasiswa
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Masukkan NIM untuk melihat kartu mahasiswa Anda
              </p>

              <div className="mt-6 flex gap-3">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    value={nim}
                    onChange={(e) => {
                      setNim(e.target.value);
                      setError(null);
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Contoh: 2024010101"
                    disabled={isPending}
                    className="h-12 pl-12 text-base"
                  />
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isPending || !nim.trim()}
                  className="h-12 gap-2 px-8"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Mencari...
                    </>
                  ) : (
                    "Tampilkan KTM"
                  )}
                </Button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* KTM Preview */}
          {mahasiswa && (
            <div className="mx-auto mt-8 max-w-2xl">
              <KtmPreviewCard mahasiswa={mahasiswa} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
