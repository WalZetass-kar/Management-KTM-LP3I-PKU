"use client";

import { useState, useTransition } from "react";
import { Search, Loader2, CreditCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KtmPreviewModern } from "@/components/landing/ktm-preview-modern";
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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#070e1a] via-[#0f2847] to-[#0a1628] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      {/* Background Pattern – hexagonal */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="hero-hex"
              width="56"
              height="100"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(1.2)"
            >
              <path
                d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
                fill="none"
                stroke="white"
                strokeWidth="0.6"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-hex)" />
        </svg>
      </div>

      {/* Gradient glow blobs */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#1e5faa]/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-[#60a5fa]/8 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          {/* Badge */}
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-[#60a5fa]" />
            <span className="text-sm font-medium text-[#93c5fd]">
              Sistem KTM Digital — Politeknik LP3I Pekanbaru
            </span>
          </div>

          {/* Title */}
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Kartu Tanda Mahasiswa{" "}
            <span className="bg-gradient-to-r from-[#60a5fa] to-[#93c5fd] bg-clip-text text-transparent">
              Digital
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#94a3b8] sm:text-xl">
            Buat dan verifikasi kartu mahasiswa dengan cepat, aman, dan modern
          </p>

          {/* NIM Search Card */}
          <div className="mx-auto mt-12 max-w-2xl">
            <div className="rounded-2xl border border-white/10 bg-white/[0.97] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f2847]/10">
                  <CreditCard className="h-5 w-5 text-[#0f2847]" />
                </div>
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-[#0f1e36]">
                    Cari Kartu Mahasiswa
                  </h2>
                  <p className="text-sm text-[#64748b]">
                    Masukkan NIM untuk melihat KTM Anda
                  </p>
                </div>
              </div>

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
                  className="h-12 gap-2 bg-[#0f2847] px-8 hover:bg-[#1a4a7a]"
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
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* KTM Preview */}
          {mahasiswa && (
            <div className="mx-auto mt-10 max-w-2xl">
              <KtmPreviewModern mahasiswa={mahasiswa} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
