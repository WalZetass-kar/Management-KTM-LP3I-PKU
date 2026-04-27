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
  mode?: "flip" | "front-only" | "back-only";
  autoFlip?: boolean;
  className?: string;
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

  if (mode === "front-only") {
    return (
      <div className={cn("w-full max-w-[900px]", className)}>
        <div className="aspect-[1.586/1] w-full overflow-hidden rounded-[12px] shadow-2xl">
          <CardFront student={student} campus={c} />
        </div>
      </div>
    );
  }

  if (mode === "back-only") {
    return (
      <div className={cn("w-full max-w-[900px]", className)}>
        <div className="aspect-[1.586/1] w-full overflow-hidden rounded-[12px] shadow-2xl">
          <CardBack student={student} campus={c} qrUrl={qrUrl} />
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
            className="absolute inset-0 overflow-hidden rounded-[12px] shadow-2xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <CardFront student={student} campus={c} />
          </div>
          <div
            className="absolute inset-0 overflow-hidden rounded-[12px] shadow-2xl"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
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
// CARD FRONT — Mahasiswa Aktif
// ============================================================

function CardFront({
  student,
  campus,
}: {
  student: KTMStudentData;
  campus: Required<KTMCampusData>;
}) {
  return (
    <div className="relative h-full w-full select-none overflow-hidden">
      {/* ── Background: deep navy base ── */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(145deg, #020617 0%, #0f172a 40%, #1e293b 100%)",
        }}
      />

      {/* ── Decorative: right side accent wave ── */}
      <svg
        className="absolute right-0 top-0 h-full w-[55%] opacity-100"
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M120 0 H400 V300 H80 Q150 240 130 180 Q110 120 160 60 Q180 30 120 0Z"
          fill="url(#mahasiswa-wave)"
        />
        <defs>
          <linearGradient id="mahasiswa-wave" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="50%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── Fine grid pattern ── */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ktm-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ktm-grid)" />
      </svg>

      {/* ── Glow orbs ── */}
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/15 blur-[80px]" />
      <div className="absolute -bottom-16 left-[5%] h-44 w-44 rounded-full bg-blue-400/10 blur-[60px]" />
      <div className="absolute right-[30%] top-[50%] h-32 w-32 rounded-full bg-cyan-400/8 blur-[50px]" />

      {/* ── HEADER BAR ── */}
      <div className="absolute left-0 right-0 top-0 z-20">
        <div className="flex items-center justify-between bg-white/[0.97] px-[4.5%] py-[2.5%] shadow-[0_2px_16px_rgba(0,0,0,0.12)]">
          <div className="flex items-center gap-[2.5%]">
            <div className="relative aspect-square w-[9.5%] min-w-[2.2rem]">
              <Image
                src={campus.logoUrl}
                alt="Logo Kampus"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="border-l-[2px] border-slate-200 pl-[2%]">
              <h1 className="text-[clamp(0.6rem,1.25vw,0.95rem)] font-extrabold uppercase leading-tight tracking-tight text-slate-900">
                {campus.namaKampus.split(" ").slice(0, 2).join(" ")}
              </h1>
              <p className="text-[clamp(0.38rem,0.78vw,0.58rem)] font-semibold uppercase tracking-[0.2em] text-slate-400">
                {campus.namaKampus.split(" ").slice(2).join(" ")}
              </p>
            </div>
          </div>
          <div className="rounded-md bg-gradient-to-r from-slate-800 to-slate-900 px-[2.5%] py-[1%] shadow-sm">
            <p className="text-[clamp(0.35rem,0.72vw,0.55rem)] font-bold uppercase tracking-[0.2em] text-white">
              Kartu Tanda Mahasiswa
            </p>
          </div>
        </div>
        {/* Gold accent line */}
        <div
          className="h-[2.5px]"
          style={{
            background: "linear-gradient(90deg, #b45309, #f59e0b, #fbbf24, #f59e0b, #b45309)",
          }}
        />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="absolute inset-0 top-[22%] flex">
        {/* Photo Section */}
        <div className="flex w-[30%] items-center justify-center px-[3%] py-[2.5%]">
          <div className="relative w-full">
            {/* Gold border frame */}
            <div
              className="overflow-hidden rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
              style={{
                padding: "2.5px",
                background: "linear-gradient(145deg, #d97706, #fbbf24, #d97706)",
              }}
            >
              <div className="overflow-hidden rounded-[9px] bg-white">
                {student.fotoUrl ? (
                  <img
                    src={student.fotoUrl}
                    alt={student.nama}
                    className="aspect-[3/4] w-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
                    <span className="text-[clamp(2.5rem,5vw,4rem)] font-black text-white/80">
                      {student.nama.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Ambient glow */}
            <div className="absolute -bottom-3 -right-3 h-16 w-16 rounded-full bg-blue-400/20 blur-xl" />
          </div>
        </div>

        {/* Info Section */}
        <div className="flex w-[70%] flex-col justify-between px-[2%] py-[2.5%] pr-[5%]">
          <div className="space-y-[5%]">
            {/* NIM */}
            <div>
              <p className="text-[clamp(0.35rem,0.72vw,0.52rem)] font-semibold uppercase tracking-[0.25em] text-blue-300/60">
                Nomor Induk Mahasiswa
              </p>
              <p
                className="mt-[1.5%] font-mono text-[clamp(1.3rem,2.8vw,2.2rem)] font-black leading-none tracking-tight text-white"
                style={{ textShadow: "0 2px 20px rgba(59,130,246,0.3)" }}
              >
                {student.nim}
              </p>
            </div>

            {/* Divider */}
            <div
              className="h-[1px]"
              style={{
                background: "linear-gradient(90deg, rgba(255,255,255,0.15), rgba(251,191,36,0.2), transparent)",
              }}
            />

            {/* Name */}
            <div>
              <p className="text-[clamp(0.35rem,0.72vw,0.52rem)] font-semibold uppercase tracking-[0.25em] text-blue-300/60">
                Nama Lengkap
              </p>
              <h2 className="mt-[1.5%] text-[clamp(1rem,2.2vw,1.75rem)] font-black uppercase leading-[1.05] tracking-tight text-white">
                {student.nama}
              </h2>
            </div>

            {/* Study Program */}
            <div>
              <p className="text-[clamp(0.35rem,0.72vw,0.52rem)] font-semibold uppercase tracking-[0.25em] text-blue-300/60">
                Program Studi
              </p>
              <p className="mt-[1%] text-[clamp(0.7rem,1.5vw,1.15rem)] font-bold uppercase tracking-wide text-white/85">
                {student.jurusan}
              </p>
              {student.fakultas && (
                <p className="mt-[0.5%] text-[clamp(0.35rem,0.72vw,0.52rem)] font-medium text-white/40">
                  {student.fakultas}
                </p>
              )}
            </div>
          </div>

          {/* Validity + Status */}
          <div className="mt-auto">
            <div
              className="inline-flex w-full items-center gap-[5%] rounded-xl px-[4%] py-[2.5%]"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="flex-1">
                <p className="text-[clamp(0.32rem,0.65vw,0.48rem)] font-semibold uppercase tracking-wider text-amber-300/70">
                  Masa Berlaku
                </p>
                <p className="mt-[3%] text-[clamp(0.85rem,1.7vw,1.35rem)] font-black leading-none tracking-tight text-white">
                  {student.masaBerlaku}
                </p>
              </div>
              <div className="h-[1.8rem] w-px bg-white/12" />
              <div>
                <p className="text-[clamp(0.32rem,0.65vw,0.48rem)] font-semibold uppercase tracking-wider text-white/40">
                  Status
                </p>
                <div className="mt-[3%] inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/12 px-[10%] py-[4%]">
                  <span
                    className="h-[5px] w-[5px] rounded-full bg-emerald-400"
                    style={{ boxShadow: "0 0 6px rgba(52,211,153,0.8)" }}
                  />
                  <span className="text-[clamp(0.32rem,0.65vw,0.48rem)] font-bold tracking-wider text-emerald-300">
                    AKTIF
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom gold accent ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2.5px]"
        style={{
          background: "linear-gradient(90deg, #b45309, #f59e0b, #fbbf24, #f59e0b, #b45309)",
        }}
      />
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
    <div className="relative h-full w-full select-none overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-white to-[#f1f5f9]" />

      {/* Subtle dot pattern */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ktm-back-dot" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="0.8" fill="#0f172a" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ktm-back-dot)" />
      </svg>

      {/* Top gold accent */}
      <div
        className="absolute left-0 right-0 top-0 z-10 h-[2.5px]"
        style={{
          background: "linear-gradient(90deg, #b45309, #f59e0b, #fbbf24, #f59e0b, #b45309)",
        }}
      />

      {/* Navy header strip */}
      <div
        className="absolute left-0 right-0 top-[2.5px] z-10 px-[5%] py-[1.8%]"
        style={{ background: "linear-gradient(90deg, #020617 0%, #0f172a 100%)" }}
      >
        <div className="flex items-center gap-[2%]">
          <div className="relative aspect-square w-[5.5%] min-w-[1.4rem]">
            <Image src={campus.logoUrl} alt="Logo" fill className="object-contain brightness-0 invert" />
          </div>
          <p className="text-[clamp(0.44rem,0.88vw,0.68rem)] font-bold uppercase tracking-wider text-white/85">
            {campus.namaKampus}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col px-[5%] pb-[3.5%] pt-[14%]">
        <div className="flex flex-1 gap-[4%]">
          {/* QR Code */}
          <div className="flex w-[34%] flex-col items-center justify-center">
            <div className="w-full max-w-[85%]">
              {qrUrl ? (
                <div
                  className="overflow-hidden rounded-xl bg-white p-[8%]"
                  style={{
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    border: "1.5px solid #e2e8f0",
                  }}
                >
                  <img
                    src={qrUrl}
                    alt="QR Code"
                    className="aspect-square w-full object-contain"
                    crossOrigin="anonymous"
                  />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
                  <QrCode className="h-[40%] w-[40%] text-slate-300" />
                </div>
              )}
              <p className="mt-[6%] text-center text-[clamp(0.35rem,0.68vw,0.5rem)] font-semibold text-slate-400">
                Scan untuk verifikasi
              </p>
              <p className="mt-[2%] text-center font-mono text-[clamp(0.4rem,0.76vw,0.58rem)] font-bold text-slate-700">
                {student.nim}
              </p>
            </div>
          </div>

          {/* Right info */}
          <div className="flex w-[66%] flex-col justify-between">
            {/* Campus info */}
            <div
              className="rounded-xl p-[5%]"
              style={{
                background: "linear-gradient(135deg, #ffffff, #f8fafc)",
                border: "1.5px solid #e2e8f0",
                boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
              }}
            >
              <h3 className="mb-[4%] text-[clamp(0.44rem,0.85vw,0.65rem)] font-bold uppercase tracking-[0.18em] text-slate-800">
                Informasi Kampus
              </h3>
              <div className="space-y-[5%]">
                <div className="flex items-start gap-[3%]">
                  <MapPin className="mt-0.5 h-[0.8rem] w-[0.8rem] shrink-0 text-blue-500" />
                  <p className="text-[clamp(0.35rem,0.7vw,0.54rem)] leading-relaxed text-slate-500">{campus.alamat}</p>
                </div>
                <div className="flex items-center gap-[3%]">
                  <Mail className="h-[0.8rem] w-[0.8rem] shrink-0 text-blue-500" />
                  <p className="text-[clamp(0.35rem,0.7vw,0.54rem)] text-slate-500">{campus.email}</p>
                </div>
                <div className="flex items-center gap-[3%]">
                  <Globe className="h-[0.8rem] w-[0.8rem] shrink-0 text-blue-500" />
                  <p className="text-[clamp(0.35rem,0.7vw,0.54rem)] text-slate-500">{campus.website}</p>
                </div>
                <div className="flex items-center gap-[3%]">
                  <Phone className="h-[0.8rem] w-[0.8rem] shrink-0 text-blue-500" />
                  <p className="text-[clamp(0.35rem,0.7vw,0.54rem)] text-slate-500">{campus.telepon}</p>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div
              className="mt-[4%] rounded-xl p-[4%]"
              style={{
                background: "linear-gradient(135deg, #eff6ff, #ffffff)",
                border: "1.5px solid #e2e8f0",
              }}
            >
              <h4 className="mb-[3%] text-[clamp(0.35rem,0.7vw,0.52rem)] font-bold uppercase tracking-[0.15em] text-slate-700">
                Ketentuan Penggunaan
              </h4>
              <ul className="space-y-[2%] text-[clamp(0.3rem,0.6vw,0.46rem)] leading-relaxed text-slate-400">
                <li>• Kartu ini adalah identitas resmi mahasiswa</li>
                <li>• Tidak dapat dipindahtangankan kepada pihak lain</li>
                <li>• Wajib dibawa saat berada di lingkungan kampus</li>
                <li>• Segera lapor ke bagian akademik jika hilang</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-slate-100 pt-[1.8%]">
          <p className="text-center text-[clamp(0.28rem,0.55vw,0.42rem)] font-medium text-slate-300">
            ID: {student.nim} • Kartu ini sah dan dilindungi • ©{" "}
            {new Date().getFullYear()} {campus.namaKampus}
          </p>
        </div>
      </div>

      {/* Bottom gold accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2.5px]"
        style={{
          background: "linear-gradient(90deg, #b45309, #f59e0b, #fbbf24, #f59e0b, #b45309)",
        }}
      />
    </div>
  );
}
