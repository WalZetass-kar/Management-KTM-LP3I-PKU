"use client";

import { useState } from "react";
import Image from "next/image";
import { QrCode, Briefcase, MapPin, GraduationCap, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AlumniKTMData {
  nama: string;
  nim: string;
  jurusan: string;
  tahunLulus: string;
  fotoUrl: string | null;
  pekerjaan?: string | null;
  perusahaan?: string | null;
  lokasi?: string | null;
}

interface AlumniKTMCardProps {
  alumni: AlumniKTMData;
  qrUrl?: string;
  mode?: "flip" | "front-only" | "back-only";
  autoFlip?: boolean;
  className?: string;
  showFlipHint?: boolean;
}

const DEFAULT_CAMPUS = {
  logoUrl: "/images/logo-lp3i.png",
  namaKampus: "POLITEKNIK LP3I PEKANBARU",
  alamat: "Jl. Riau No. 1, Pekanbaru, Riau 28282",
  email: "info@lp3i.ac.id",
  website: "www.lp3i.ac.id",
  telepon: "(0761) 123456",
};

export function AlumniKTMCard({
  alumni,
  qrUrl,
  mode = "flip",
  autoFlip = false,
  className,
  showFlipHint = true,
}: AlumniKTMCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    if (mode === "flip") setIsFlipped((prev) => !prev);
  };

  if (mode === "front-only") {
    return (
      <div className={cn("w-full max-w-[900px]", className)}>
        <div className="aspect-[1.586/1] w-full overflow-hidden rounded-[10px] shadow-2xl">
          <CardFront alumni={alumni} />
        </div>
      </div>
    );
  }

  if (mode === "back-only") {
    return (
      <div className={cn("w-full max-w-[900px]", className)}>
        <div className="aspect-[1.586/1] w-full overflow-hidden rounded-[10px] shadow-2xl">
          <CardBack alumni={alumni} qrUrl={qrUrl} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-[900px]", className)}>
      <div
        className="group relative aspect-[1.586/1] w-full cursor-pointer"
        style={{ perspective: "1200px" }}
        onClick={handleFlip}
        onMouseEnter={() => autoFlip && setIsFlipped(true)}
        onMouseLeave={() => autoFlip && setIsFlipped(false)}
      >
        <div
          className={cn(
            "relative h-full w-full transition-transform duration-700 ease-in-out transform-gpu",
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0 overflow-hidden rounded-[10px] shadow-2xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <CardFront alumni={alumni} />
          </div>

          <div
            className="absolute inset-0 overflow-hidden rounded-[10px] shadow-2xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <CardBack alumni={alumni} qrUrl={qrUrl} />
          </div>
        </div>
      </div>

      {showFlipHint && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <RotateCcw className="h-4 w-4" />
          <span>
            Klik kartu untuk melihat sisi {isFlipped ? "depan" : "belakang"}
          </span>
        </div>
      )}
    </div>
  );
}

function CardFront({ alumni }: { alumni: AlumniKTMData }) {
  return (
    <div className="relative h-full w-full select-none">
      {/* Background - Biru LP3I dengan gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0047AB] via-[#1E5BA8] to-[#2E6FA5]">
        <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="alumni-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="white" />
              <circle cx="0" cy="0" r="2" fill="white" />
              <circle cx="60" cy="60" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#alumni-pattern)" />
        </svg>
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      </div>

      {/* Header Bar */}
      <div className="absolute left-0 right-0 top-0 z-20">
        <div className="flex items-center justify-between bg-white/95 px-[4.5%] py-[2.5%] shadow-lg">
          <div className="flex items-center gap-[2.5%]">
            <div className="relative aspect-square w-[10%] min-w-[2.5rem]">
              <Image src={DEFAULT_CAMPUS.logoUrl} alt="Logo" fill className="object-contain" priority />
            </div>
            <div className="border-l-[2.5px] border-[#0047AB]/20 pl-[2%]">
              <h1 className="text-[clamp(0.7rem,1.5vw,1.1rem)] font-extrabold uppercase leading-tight tracking-tight text-[#0047AB]">
                {DEFAULT_CAMPUS.namaKampus.split(" ").slice(0, 2).join(" ")}
              </h1>
              <p className="text-[clamp(0.5rem,1vw,0.75rem)] font-semibold uppercase tracking-wider text-[#0047AB]/70">
                {DEFAULT_CAMPUS.namaKampus.split(" ").slice(2).join(" ")}
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-[2.5%] py-[1.2%] shadow-md">
            <p className="text-[clamp(0.45rem,0.9vw,0.7rem)] font-bold uppercase tracking-[0.15em] text-white">
              Kartu Alumni
            </p>
          </div>
        </div>
        <div className="h-[3px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500" />
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 top-[22%] flex">
        {/* Photo Section */}
        <div className="flex w-[30%] items-center justify-center px-[3%] py-[3%]">
          <div className="relative w-full">
            <div className="overflow-hidden rounded-xl border-[3px] border-white/30 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              {alumni.fotoUrl ? (
                <img
                  src={alumni.fotoUrl}
                  alt={alumni.nama}
                  className="aspect-[3/4] w-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-[#1E5BA8] to-[#0047AB]">
                  <span className="text-[clamp(2.5rem,5vw,4rem)] font-black text-white/90">
                    {alumni.nama.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-3 -right-3 h-16 w-16 rounded-full bg-amber-400/20 blur-xl" />
          </div>
        </div>

        {/* Info Section */}
        <div className="flex w-[70%] flex-col justify-between px-[3%] py-[3%] pr-[5%]">
          <div className="space-y-[5%]">
            {/* NIM */}
            <div>
              <p className="text-[clamp(0.45rem,0.85vw,0.65rem)] font-semibold uppercase tracking-[0.2em] text-white/80">
                Nomor Induk Mahasiswa
              </p>
              <p className="mt-[2%] font-mono text-[clamp(1.3rem,2.8vw,2.2rem)] font-black leading-none tracking-tight text-white">
                {alumni.nim}
              </p>
            </div>

            <div className="h-px bg-gradient-to-r from-white/30 via-white/20 to-transparent" />

            {/* Name */}
            <div>
              <p className="text-[clamp(0.45rem,0.85vw,0.65rem)] font-semibold uppercase tracking-[0.2em] text-white/80">
                Nama Lengkap
              </p>
              <h2 className="mt-[2%] text-[clamp(1.1rem,2.3vw,1.9rem)] font-black uppercase leading-[1.05] tracking-tight text-white">
                {alumni.nama}
              </h2>
            </div>

            {/* Program Studi */}
            <div>
              <p className="text-[clamp(0.45rem,0.85vw,0.65rem)] font-semibold uppercase tracking-[0.2em] text-white/80">
                Program Studi
              </p>
              <p className="mt-[2%] text-[clamp(0.75rem,1.5vw,1.2rem)] font-bold uppercase tracking-wide text-white/95">
                {alumni.jurusan}
              </p>
            </div>

            {/* Pekerjaan (jika ada) */}
            {alumni.pekerjaan && (
              <div>
                <p className="text-[clamp(0.4rem,0.75vw,0.6rem)] font-semibold uppercase tracking-[0.2em] text-white/70">
                  Pekerjaan Saat Ini
                </p>
                <p className="mt-[1%] text-[clamp(0.65rem,1.3vw,1rem)] font-bold text-white/90">
                  {alumni.pekerjaan}
                  {alumni.perusahaan && <span className="font-normal"> • {alumni.perusahaan}</span>}
                </p>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-auto">
            <div className="inline-flex items-center gap-[6%] rounded-lg border border-white/15 bg-white/[0.08] px-[4%] py-[2.5%] backdrop-blur-sm">
              <div>
                <p className="text-[clamp(0.4rem,0.75vw,0.55rem)] font-semibold uppercase tracking-wider text-amber-300/90">
                  Tahun Lulus
                </p>
                <p className="mt-[3%] text-[clamp(0.95rem,1.9vw,1.4rem)] font-black leading-none tracking-tight text-white">
                  {alumni.tahunLulus}
                </p>
              </div>
              <div className="mx-[2%] h-[2rem] w-px bg-white/20" />
              <div className="text-right">
                <p className="text-[clamp(0.4rem,0.75vw,0.55rem)] font-semibold text-white/60">Status</p>
                <div className="mt-[3%] inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-[8%] py-[3%]">
                  <GraduationCap className="h-3 w-3 text-amber-300" />
                  <span className="text-[clamp(0.4rem,0.75vw,0.55rem)] font-bold text-amber-200">ALUMNI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500" />
    </div>
  );
}

function CardBack({ alumni, qrUrl }: { alumni: AlumniKTMData; qrUrl?: string }) {
  return (
    <div className="relative h-full w-full select-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-white to-[#f0f6ff]">
        <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="alumni-back-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40L40 0M-10 10L10 -10M30 50L50 30" stroke="#0047AB" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#alumni-back-pattern)" />
        </svg>
      </div>

      <div className="absolute left-0 right-0 top-0 z-10 h-[2px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500" />

      <div className="absolute left-0 right-0 top-[2px] z-10 bg-gradient-to-r from-[#0047AB] to-[#1E5BA8] px-[5%] py-[2%]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[2%]">
            <div className="relative aspect-square w-[6%] min-w-[1.5rem]">
              <Image src={DEFAULT_CAMPUS.logoUrl} alt="Logo" fill className="object-contain brightness-0 invert" />
            </div>
            <p className="text-[clamp(0.5rem,1vw,0.75rem)] font-bold uppercase tracking-wider text-white/95">
              {DEFAULT_CAMPUS.namaKampus}
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col px-[5%] pb-[4%] pt-[14%]">
        <div className="flex flex-1 gap-[4%]">
          {/* QR Code Section */}
          <div className="flex w-[35%] flex-col items-center justify-center">
            <div className="w-full max-w-[85%]">
              {qrUrl ? (
                <div className="overflow-hidden rounded-xl border-2 border-[#0047AB]/20 bg-white p-[8%] shadow-lg">
                  <img src={qrUrl} alt="QR Code" className="aspect-square w-full object-contain" crossOrigin="anonymous" />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-[#0047AB]/30 bg-[#f8fafc]">
                  <QrCode className="h-[40%] w-[40%] text-[#0047AB]/40" />
                </div>
              )}
              <p className="mt-[6%] text-center text-[clamp(0.4rem,0.7vw,0.55rem)] font-semibold text-[#0047AB]/70">
                Scan untuk verifikasi
              </p>
              <p className="mt-[2%] text-center font-mono text-[clamp(0.45rem,0.8vw,0.6rem)] font-bold text-[#0047AB]">
                {alumni.nim}
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex w-[65%] flex-col justify-between">
            {/* Alumni Info */}
            <div className="rounded-xl border-2 border-[#0047AB]/10 bg-gradient-to-br from-[#f0f6ff] to-white p-[5%] shadow-sm">
              <h3 className="mb-[4%] flex items-center gap-2 text-[clamp(0.5rem,0.9vw,0.7rem)] font-bold uppercase tracking-[0.15em] text-[#0047AB]">
                <GraduationCap className="h-4 w-4" />
                Informasi Alumni
              </h3>
              <div className="space-y-[4%]">
                <div>
                  <p className="text-[clamp(0.35rem,0.65vw,0.5rem)] font-semibold uppercase text-[#0047AB]/60">
                    Tahun Lulus
                  </p>
                  <p className="text-[clamp(0.5rem,0.9vw,0.7rem)] font-bold text-[#0047AB]">{alumni.tahunLulus}</p>
                </div>
                {alumni.pekerjaan && (
                  <div className="flex items-start gap-[3%]">
                    <Briefcase className="mt-0.5 h-[0.85rem] w-[0.85rem] shrink-0 text-[#0047AB]" />
                    <div>
                      <p className="text-[clamp(0.35rem,0.65vw,0.5rem)] font-semibold uppercase text-[#0047AB]/60">
                        Pekerjaan
                      </p>
                      <p className="text-[clamp(0.45rem,0.8vw,0.65rem)] font-bold leading-relaxed text-[#475569]">
                        {alumni.pekerjaan}
                      </p>
                      {alumni.perusahaan && (
                        <p className="text-[clamp(0.4rem,0.75vw,0.6rem)] text-[#64748b]">{alumni.perusahaan}</p>
                      )}
                    </div>
                  </div>
                )}
                {alumni.lokasi && (
                  <div className="flex items-center gap-[3%]">
                    <MapPin className="h-[0.85rem] w-[0.85rem] shrink-0 text-[#0047AB]" />
                    <p className="text-[clamp(0.4rem,0.75vw,0.6rem)] text-[#475569]">{alumni.lokasi}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Campus Info */}
            <div className="mt-[4%] rounded-xl border border-[#e2e8f0] bg-white/80 p-[4%] shadow-sm">
              <h4 className="mb-[3%] text-[clamp(0.4rem,0.75vw,0.55rem)] font-bold uppercase tracking-[0.12em] text-[#0047AB]">
                Kontak Kampus
              </h4>
              <div className="space-y-[2%] text-[clamp(0.35rem,0.65vw,0.5rem)] leading-relaxed text-[#64748b]">
                <p>📍 {DEFAULT_CAMPUS.alamat}</p>
                <p>📧 {DEFAULT_CAMPUS.email}</p>
                <p>🌐 {DEFAULT_CAMPUS.website}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto border-t border-[#e2e8f0] pt-[2%]">
          <p className="text-center text-[clamp(0.35rem,0.6vw,0.5rem)] font-medium text-[#94a3b8]">
            Alumni ID: {alumni.nim} • Kartu ini sah dan dilindungi • © {new Date().getFullYear()} {DEFAULT_CAMPUS.namaKampus}
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500" />
    </div>
  );
}
