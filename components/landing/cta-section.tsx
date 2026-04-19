import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#070e1a] via-[#0f2847] to-[#0a1628] px-4 py-20 sm:px-6 lg:px-8">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="cta-dots"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="16" cy="16" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-dots)" />
        </svg>
      </div>

      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-[#2a74c4]/10 blur-[100px]" />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-sm">
          <Shield className="h-8 w-8 text-[#60a5fa]" />
        </div>

        {/* Content */}
        <h2 className="mt-8 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Kelola Sistem KTM dengan Mudah
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[#94a3b8]">
          Akses dashboard admin untuk mengelola data mahasiswa, menerbitkan
          kartu, dan memverifikasi identitas dengan sistem yang aman dan
          terintegrasi.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/login">
            <Button
              size="lg"
              className="h-14 gap-2 bg-white px-8 text-base font-semibold text-[#0f2847] shadow-xl hover:bg-[#f0f6ff]"
            >
              Masuk sebagai Admin
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="#hero">
            <Button
              size="lg"
              variant="outline"
              className="h-14 border-2 border-white/20 bg-transparent px-8 text-base font-semibold text-white hover:border-white/40 hover:bg-white/[0.06]"
            >
              Cari KTM Saya
            </Button>
          </Link>
        </div>

        {/* Info */}
        <p className="mt-8 text-sm text-[#64748b]">
          Hanya admin yang memiliki akses ke dashboard sistem
        </p>
      </div>
    </section>
  );
}
