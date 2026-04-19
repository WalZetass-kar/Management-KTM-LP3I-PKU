"use client";

import { useState } from "react";
import Image from "next/image";
import { QrCode, MapPin, Mail, Globe, Phone, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// Types
// ============================================================

export interface KTMStudentData {
  nama: string;
  nim: string;
  jurusan: string;
  fakultas?: string;
  masaBerlaku: string;
  fotoUrl: string | null;
}

export interface KTMCampusData {
  logoUrl?: string;
  namaKampus?: string;
  alamat?: string;
  email?: string;
  website?: string;
  telepon?: string;
}

export interface KTMCardModernProps {
  student: KTMStudentData;
  campus?: KTMCampusData;
  qrUrl?: string;
  /** Render only one side (for download/print), or interactive flip */
  mode?: "flip" | "front-only" | "back-only";
  /** Enable auto-flip on hover */
  autoFlip?: boolean;
  /** Extra class on the outermost wrapper */
  className?: string;
  /** When true, shows the flip indicator text below the card */
  showFlipHint?: boolean;
}

// ============================================================
// Defaults
// ============================================================

const DEFAULT_CAMPUS: Required<KTMCampusData> = {
  logoUrl: "/images/logo-lp3i.png",
  namaKampus: "POLITEKNIK LP3I KAMPUS PEKANBARU",
  alamat: "Jl. Riau No. 1, Pekanbaru, Riau 28282",
  email: "info@lp3i.ac.id",
  website: "www.lp3i.ac.id",
  telepon: "(0761) 123456",
};

// ============================================================
// Main Component
// ============================================================

export function KTMCardModern({
  student,
  campus,
  qrUrl,
  mode = "flip",
  autoFlip = false,
  className,
  showFlipHint = true,
}: KTMCardModernProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const c = { ...DEFAULT_CAMPUS, ...campus };

  const handleFlip = () => {
    if (mode === "flip") setIsFlipped((prev) => !prev);
  };

  // ---- Front-only / Back-only (for print / download) ----
  if (mode === "front-only") {
    return (
      <div className={cn("w-full max-w-[900px]", className)}>
        <div className="aspect-[1.586/1] w-full overflow-hidden rounded-[10px] shadow-2xl">
          <CardFront student={student} campus={c} />
        </div>
      </div>
    );
  }

  if (mode === "back-only") {
    return (
      <div className={cn("w-full max-w-[900px]", className)}>
        <div className="aspect-[1.586/1] w-full overflow-hidden rounded-[10px] shadow-2xl">
          <CardBack student={student} campus={c} qrUrl={qrUrl} />
        </div>
      </div>
    );
  }

  // ---- Interactive flip mode ----
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
          {/* FRONT */}
          <div
            className="absolute inset-0 overflow-hidden rounded-[10px] shadow-2xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <CardFront student={student} campus={c} />
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 overflow-hidden rounded-[10px] shadow-2xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <CardBack student={student} campus={c} qrUrl={qrUrl} />
          </div>
        </div>
      </div>

      {showFlipHint && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <RotateCcw className="h-4 w-4" />
          <span>
            Klik kartu untuk melihat sisi{" "}
            {isFlipped ? "depan" : "belakang"}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CARD FRONT
// ============================================================

function CardFront({
  student,
  campus,
}: {
  student: KTMStudentData;
  campus: Required<KTMCampusData>;
}) {
  return (
    <div className="relative h-full w-full select-none">
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0f2847] to-[#132e52]">
        {/* Subtle geometric pattern */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="ktm-hex"
              width="56"
              height="100"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(0.8)"
            >
              <path
                d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
              <path
                d="M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ktm-hex)" />
        </svg>

        {/* Gradient glow accents */}
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#1e5faa]/20 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-[#2a74c4]/15 blur-2xl" />
      </div>

      {/* ── Header Bar ── */}
      <div className="absolute left-0 right-0 top-0 z-20">
        <div className="flex items-center justify-between bg-white/[0.97] px-[4.5%] py-[2.8%] shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-[2.5%]">
            <div className="relative aspect-square w-[10%] min-w-[2.5rem]">
              <Image
                src={campus.logoUrl}
                alt="Logo Kampus"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="border-l-[2.5px] border-[#0f2847]/20 pl-[2%]">
              <h1 className="text-[clamp(0.7rem,1.5vw,1.1rem)] font-extrabold uppercase leading-tight tracking-tight text-[#0f2847]">
                {campus.namaKampus.split(" ").slice(0, 2).join(" ")}
              </h1>
              <p className="text-[clamp(0.5rem,1vw,0.75rem)] font-semibold uppercase tracking-wider text-[#0f2847]/60">
                {campus.namaKampus.split(" ").slice(2).join(" ")}
              </p>
            </div>
          </div>
          <div className="rounded-md bg-gradient-to-r from-[#0f2847] to-[#1a4a7a] px-[2.5%] py-[1%] shadow-sm">
            <p className="text-[clamp(0.45rem,0.9vw,0.7rem)] font-bold uppercase tracking-[0.15em] text-white">
              Kartu Tanda Mahasiswa
            </p>
          </div>
        </div>
        {/* Accent line */}
        <div className="h-[2.5px] bg-gradient-to-r from-[#2a74c4] via-[#60a5fa] to-[#2a74c4]" />
      </div>

      {/* ── Main Content ── */}
      <div className="absolute inset-0 top-[22%] flex">
        {/* Photo Section */}
        <div className="flex w-[30%] items-center justify-center px-[3%] py-[3%]">
          <div className="relative w-full">
            <div className="overflow-hidden rounded-xl border-[3px] border-white/25 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              {student.fotoUrl ? (
                <img
                  src={student.fotoUrl}
                  alt={student.nama}
                  className="aspect-[3/4] w-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-[#1a4a7a] to-[#0f2847]">
                  <span className="text-[clamp(2.5rem,5vw,4rem)] font-black text-white/90">
                    {student.nama.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {/* Glow behind photo */}
            <div className="absolute -bottom-3 -right-3 h-16 w-16 rounded-full bg-[#60a5fa]/15 blur-xl" />
          </div>
        </div>

        {/* Info Section */}
        <div className="flex w-[70%] flex-col justify-between px-[3%] py-[3%] pr-[5%]">
          <div className="space-y-[6%]">
            {/* NIM */}
            <div>
              <p className="text-[clamp(0.45rem,0.85vw,0.65rem)] font-semibold uppercase tracking-[0.2em] text-[#60a5fa]/80">
                Nomor Induk Mahasiswa
              </p>
              <p className="mt-[2%] font-mono text-[clamp(1.4rem,3vw,2.4rem)] font-black leading-none tracking-tight text-white">
                {student.nim}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent" />

            {/* Name */}
            <div>
              <p className="text-[clamp(0.45rem,0.85vw,0.65rem)] font-semibold uppercase tracking-[0.2em] text-[#60a5fa]/80">
                Nama Lengkap
              </p>
              <h2 className="mt-[2%] text-[clamp(1.2rem,2.5vw,2rem)] font-black uppercase leading-[1.05] tracking-tight text-white">
                {student.nama}
              </h2>
            </div>

            {/* Study Program + Faculty */}
            <div>
              <p className="text-[clamp(0.45rem,0.85vw,0.65rem)] font-semibold uppercase tracking-[0.2em] text-[#60a5fa]/80">
                Program Studi
              </p>
              <p className="mt-[2%] text-[clamp(0.8rem,1.6vw,1.25rem)] font-bold uppercase tracking-wide text-white/90">
                {student.jurusan}
              </p>
              {student.fakultas && (
                <p className="mt-[1%] text-[clamp(0.45rem,0.9vw,0.7rem)] font-medium text-white/50">
                  {student.fakultas}
                </p>
              )}
            </div>
          </div>

          {/* Validity Period */}
          <div className="mt-auto">
            <div className="inline-flex items-center gap-[6%] rounded-lg border border-white/10 bg-white/[0.07] px-[4%] py-[2.5%] backdrop-blur-sm">
              <div>
                <p className="text-[clamp(0.4rem,0.75vw,0.55rem)] font-semibold uppercase tracking-wider text-[#60a5fa]/70">
                  Masa Berlaku
                </p>
                <p className="mt-[3%] text-[clamp(1rem,2vw,1.5rem)] font-black leading-none tracking-tight text-white">
                  {student.masaBerlaku}
                </p>
              </div>
              <div className="mx-[2%] h-[2rem] w-px bg-white/15" />
              <div className="text-right">
                <p className="text-[clamp(0.4rem,0.75vw,0.55rem)] font-semibold text-white/50">
                  Status
                </p>
                <div className="mt-[3%] inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-[8%] py-[3%]">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                  <span className="text-[clamp(0.4rem,0.75vw,0.55rem)] font-bold text-emerald-300">
                    AKTIF
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Accent ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#2a74c4] via-[#60a5fa] to-[#2a74c4]" />
    </div>
  );
}

// ============================================================
// CARD BACK
// ============================================================

function CardBack({
  student,
  campus,
  qrUrl,
}: {
  student: KTMStudentData;
  campus: Required<KTMCampusData>;
  qrUrl?: string;
}) {
  return (
    <div className="relative h-full w-full select-none">
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-white to-[#f1f5f9]">
        {/* Subtle pattern */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.025]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="ktm-back-lines"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 40L40 0M-10 10L10 -10M30 50L50 30"
                stroke="#0f2847"
                strokeWidth="0.5"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ktm-back-lines)" />
        </svg>
      </div>

      {/* ── Top Accent ── */}
      <div className="absolute left-0 right-0 top-0 z-10 h-[1.5px] bg-gradient-to-r from-[#2a74c4] via-[#60a5fa] to-[#2a74c4]" />

      {/* ── Navy Header Strip ── */}
      <div className="absolute left-0 right-0 top-[1.5px] z-10 bg-gradient-to-r from-[#0f2847] to-[#1a4a7a] px-[5%] py-[2%]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[2%]">
            <div className="relative aspect-square w-[6%] min-w-[1.5rem]">
              <Image
                src={campus.logoUrl}
                alt="Logo"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
            <p className="text-[clamp(0.5rem,1vw,0.75rem)] font-bold uppercase tracking-wider text-white/90">
              {campus.namaKampus}
            </p>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex h-full flex-col px-[5%] pb-[4%] pt-[14%]">
        {/* QR + Contact row */}
        <div className="flex flex-1 gap-[4%]">
          {/* QR Code Section */}
          <div className="flex w-[35%] flex-col items-center justify-center">
            <div className="w-full max-w-[85%]">
              {qrUrl ? (
                <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white p-[8%] shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                  <img
                    src={qrUrl}
                    alt="QR Code"
                    className="aspect-square w-full object-contain"
                    crossOrigin="anonymous"
                  />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-[#cbd5e1] bg-[#f8fafc]">
                  <QrCode className="h-[40%] w-[40%] text-[#94a3b8]" />
                </div>
              )}
              <p className="mt-[6%] text-center text-[clamp(0.4rem,0.7vw,0.55rem)] font-semibold text-[#64748b]">
                Scan untuk verifikasi
              </p>
              <p className="mt-[2%] text-center font-mono text-[clamp(0.45rem,0.8vw,0.6rem)] font-bold text-[#0f2847]">
                {student.nim}
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex w-[65%] flex-col justify-between">
            {/* Campus Information */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white/80 p-[5%] shadow-sm">
              <h3 className="mb-[4%] text-[clamp(0.5rem,0.9vw,0.7rem)] font-bold uppercase tracking-[0.15em] text-[#0f2847]">
                Informasi Kampus
              </h3>
              <div className="space-y-[5%]">
                <div className="flex items-start gap-[3%]">
                  <MapPin className="mt-0.5 h-[0.85rem] w-[0.85rem] shrink-0 text-[#2a74c4]" />
                  <p className="text-[clamp(0.4rem,0.75vw,0.6rem)] leading-relaxed text-[#475569]">
                    {campus.alamat}
                  </p>
                </div>
                <div className="flex items-center gap-[3%]">
                  <Mail className="h-[0.85rem] w-[0.85rem] shrink-0 text-[#2a74c4]" />
                  <p className="text-[clamp(0.4rem,0.75vw,0.6rem)] text-[#475569]">
                    {campus.email}
                  </p>
                </div>
                <div className="flex items-center gap-[3%]">
                  <Globe className="h-[0.85rem] w-[0.85rem] shrink-0 text-[#2a74c4]" />
                  <p className="text-[clamp(0.4rem,0.75vw,0.6rem)] text-[#475569]">
                    {campus.website}
                  </p>
                </div>
                <div className="flex items-center gap-[3%]">
                  <Phone className="h-[0.85rem] w-[0.85rem] shrink-0 text-[#2a74c4]" />
                  <p className="text-[clamp(0.4rem,0.75vw,0.6rem)] text-[#475569]">
                    {campus.telepon}
                  </p>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="mt-[4%] rounded-xl border border-[#e2e8f0] bg-gradient-to-br from-[#f0f6ff] to-white p-[4%] shadow-sm">
              <h4 className="mb-[3%] text-[clamp(0.4rem,0.75vw,0.55rem)] font-bold uppercase tracking-[0.12em] text-[#0f2847]">
                Ketentuan Penggunaan
              </h4>
              <ul className="space-y-[2%] text-[clamp(0.35rem,0.65vw,0.5rem)] leading-relaxed text-[#64748b]">
                <li>• Kartu ini adalah identitas resmi mahasiswa</li>
                <li>• Tidak dapat dipindahtangankan kepada pihak lain</li>
                <li>• Wajib dibawa saat berada di lingkungan kampus</li>
                <li>• Segera lapor ke bagian akademik jika hilang</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-[#e2e8f0] pt-[2%]">
          <p className="text-center text-[clamp(0.35rem,0.6vw,0.5rem)] font-medium text-[#94a3b8]">
            ID: {student.nim} • Kartu ini sah dan dilindungi • ©{" "}
            {new Date().getFullYear()} {campus.namaKampus}
          </p>
        </div>
      </div>

      {/* ── Bottom Accent ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#2a74c4] via-[#60a5fa] to-[#2a74c4]" />
    </div>
  );
}
