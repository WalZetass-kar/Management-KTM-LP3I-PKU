"use client";

import { useState } from "react";
import Image from "next/image";
import { QrCode, MapPin, Mail, Globe, Phone, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface KTMCardFlipProps {
  // Data Mahasiswa
  nama: string;
  nim: string;
  jurusan: string;
  fakultas?: string;
  masaBerlaku: string;
  fotoUrl: string | null;
  
  // Data Kampus
  logoUrl?: string;
  namaKampus?: string;
  alamat?: string;
  email?: string;
  website?: string;
  telepon?: string;
  
  // QR Code
  qrUrl?: string;
  
  // Options
  autoFlip?: boolean;
  className?: string;
}

export function KTMCardFlip({
  nama,
  nim,
  jurusan,
  fakultas,
  masaBerlaku,
  fotoUrl,
  logoUrl = "/images/logo-lp3i.png",
  namaKampus = "POLITEKNIK LP3I KAMPUS PEKANBARU",
  alamat = "Jl. Riau No. 1, Pekanbaru, Riau 28282",
  email = "info@lp3i.ac.id",
  website = "www.lp3i.ac.id",
  telepon = "(0761) 123456",
  qrUrl,
  autoFlip = false,
  className,
}: KTMCardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={cn("w-full max-w-[900px]", className)}>
      {/* Flip Container */}
      <div
        className="group relative aspect-[1.586/1] w-full cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={handleFlip}
        onMouseEnter={() => autoFlip && setIsFlipped(true)}
        onMouseLeave={() => autoFlip && setIsFlipped(false)}
      >
        {/* Card Inner */}
        <div
          className={cn(
            "relative h-full w-full transition-transform duration-700",
            "transform-gpu",
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* FRONT SIDE */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl bg-white shadow-2xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <CardFront
              nama={nama}
              nim={nim}
              jurusan={jurusan}
              fakultas={fakultas}
              masaBerlaku={masaBerlaku}
              fotoUrl={fotoUrl}
              logoUrl={logoUrl}
              namaKampus={namaKampus}
            />
          </div>

          {/* BACK SIDE */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl bg-white shadow-2xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <CardBack
              nim={nim}
              qrUrl={qrUrl}
              alamat={alamat}
              email={email}
              website={website}
              telepon={telepon}
              logoUrl={logoUrl}
            />
          </div>
        </div>
      </div>

      {/* Flip Indicator */}
      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
        <RotateCcw className="h-4 w-4" />
        <span>Klik kartu untuk melihat {isFlipped ? "depan" : "belakang"}</span>
      </div>
    </div>
  );
}

// ==================== CARD FRONT ====================
interface CardFrontProps {
  nama: string;
  nim: string;
  jurusan: string;
  fakultas?: string;
  masaBerlaku: string;
  fotoUrl: string | null;
  logoUrl: string;
  namaKampus: string;
}

function CardFront({
  nama,
  nim,
  jurusan,
  fakultas,
  masaBerlaku,
  fotoUrl,
  logoUrl,
  namaKampus,
}: CardFrontProps) {
  return (
    <div className="relative h-full w-full">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb]">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-[0.06]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="front-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="2" fill="white" />
                <circle cx="0" cy="0" r="2" fill="white" />
                <circle cx="60" cy="60" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#front-pattern)" />
          </svg>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 border-b border-white/10 bg-white/95 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0">
              <Image
                src={logoUrl}
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-base font-black uppercase leading-tight tracking-tight text-[#1e3a8a]">
                {namaKampus.split(" ").slice(0, 2).join(" ")}
              </h1>
              <p className="text-xs font-bold uppercase tracking-wide text-[#1e3a8a]/70">
                {namaKampus.split(" ").slice(2).join(" ")}
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] px-4 py-2 shadow-lg">
            <p className="text-xs font-black uppercase tracking-wider text-white">
              STUDENT ID
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex h-[calc(100%-88px)]">
        {/* Left Side - Photo */}
        <div className="flex w-[32%] items-center justify-center p-6">
          <div className="relative w-full">
            {/* Photo Frame */}
            <div className="relative overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl">
              {fotoUrl ? (
                <img
                  src={fotoUrl}
                  alt={nama}
                  className="aspect-[3/4] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <span className="text-6xl font-black text-gray-400">
                    {nama.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Decorative Corner */}
            <div className="absolute -bottom-3 -right-3 h-20 w-20 rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/20 blur-xl" />
          </div>
        </div>

        {/* Right Side - Information */}
        <div className="flex w-[68%] flex-col justify-between p-6 pr-8">
          {/* Student Information */}
          <div className="space-y-5">
            {/* NIM */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                Nomor Induk Mahasiswa
              </p>
              <p className="mt-1.5 font-mono text-4xl font-black tracking-tight text-white">
                {nim}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-white/20 via-white/40 to-white/20" />

            {/* Name */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                Nama Lengkap
              </p>
              <h2 className="mt-1.5 text-3xl font-black uppercase leading-tight tracking-tight text-white">
                {nama}
              </h2>
            </div>

            {/* Program Study */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                Program Studi
              </p>
              <p className="mt-1.5 text-xl font-bold uppercase tracking-wide text-white">
                {jurusan}
              </p>
              {fakultas && (
                <p className="mt-1 text-sm font-semibold text-white/70">
                  {fakultas}
                </p>
              )}
            </div>
          </div>

          {/* Validity Period */}
          <div className="mt-auto">
            <div className="rounded-xl bg-white/95 px-5 py-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#1e3a8a]/60">
                    Masa Berlaku
                  </p>
                  <p className="mt-1 text-2xl font-black tracking-tight text-[#1e3a8a]">
                    {masaBerlaku}
                  </p>
                </div>
                <div className="h-12 w-px bg-[#1e3a8a]/10" />
                <div className="text-right">
                  <p className="text-xs font-bold text-[#1e3a8a]/60">
                    Status
                  </p>
                  <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs font-bold text-green-700">
                      AKTIF
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400" />
    </div>
  );
}

// ==================== CARD BACK ====================
interface CardBackProps {
  nim: string;
  qrUrl?: string;
  alamat?: string;
  email?: string;
  website?: string;
  telepon?: string;
  logoUrl: string;
}

function CardBack({
  nim,
  qrUrl,
  alamat,
  email,
  website,
  telepon,
  logoUrl,
}: CardBackProps) {
  return (
    <div className="relative h-full w-full">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="back-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
                <path
                  d="M 0 40 L 40 0 L 80 40 L 40 80 Z"
                  fill="none"
                  stroke="#1e3a8a"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#back-pattern)" />
          </svg>
        </div>
      </div>

      {/* Top Accent */}
      <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-between p-8">
        {/* Logo & QR Section */}
        <div className="flex w-full items-start justify-between">
          <div className="relative h-16 w-16">
            <Image
              src={logoUrl}
              alt="Logo"
              fill
              className="object-contain opacity-80"
            />
          </div>

          {/* QR Code */}
          {qrUrl ? (
            <div className="rounded-xl border-2 border-gray-200 bg-white p-3 shadow-lg">
              <img
                src={qrUrl}
                alt="QR Code"
                className="h-24 w-24 object-contain"
              />
              <p className="mt-2 text-center text-[10px] font-semibold text-gray-500">
                Scan untuk verifikasi
              </p>
            </div>
          ) : (
            <div className="flex h-32 w-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
              <QrCode className="h-12 w-12 text-gray-400" />
              <p className="mt-2 text-center text-[10px] font-semibold text-gray-400">
                QR Code
              </p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="w-full space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
            <h3 className="mb-4 text-center text-sm font-black uppercase tracking-wider text-[#1e3a8a]">
              Informasi Kampus
            </h3>

            <div className="space-y-3">
              {/* Address */}
              {alamat && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#1e3a8a]" />
                  <p className="text-xs leading-relaxed text-gray-700">
                    {alamat}
                  </p>
                </div>
              )}

              {/* Email */}
              {email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-[#1e3a8a]" />
                  <p className="text-xs text-gray-700">{email}</p>
                </div>
              )}

              {/* Website */}
              {website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 shrink-0 text-[#1e3a8a]" />
                  <p className="text-xs text-gray-700">{website}</p>
                </div>
              )}

              {/* Phone */}
              {telepon && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-[#1e3a8a]" />
                  <p className="text-xs text-gray-700">{telepon}</p>
                </div>
              )}
            </div>
          </div>

          {/* Terms */}
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#1e3a8a]">
              Ketentuan Penggunaan
            </h4>
            <ul className="space-y-1 text-[10px] leading-relaxed text-gray-600">
              <li>• Kartu ini adalah identitas resmi mahasiswa</li>
              <li>• Tidak dapat dipindahtangankan</li>
              <li>• Wajib dibawa saat berada di kampus</li>
              <li>• Harap segera melapor jika hilang</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full border-t border-gray-200 pt-4 text-center">
          <p className="text-[10px] font-semibold text-gray-500">
            ID: {nim} • Kartu ini sah dan dilindungi
          </p>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400" />
    </div>
  );
}
