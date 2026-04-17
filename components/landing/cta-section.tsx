import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
          <Shield className="h-8 w-8 text-white" />
        </div>

        {/* Content */}
        <h2 className="mt-8 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Kelola Sistem KTM dengan Mudah
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
          Akses dashboard admin untuk mengelola data mahasiswa, menerbitkan kartu, 
          dan memverifikasi identitas dengan sistem yang aman dan terintegrasi.
        </p>

        {/* CTA Button */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/login">
            <Button
              size="lg"
              className="h-14 gap-2 bg-white px-8 text-base font-semibold text-blue-900 shadow-xl hover:bg-blue-50"
            >
              Masuk sebagai Admin
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="#hero">
            <Button
              size="lg"
              variant="outline"
              className="h-14 border-2 border-white bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10"
            >
              Cari KTM Saya
            </Button>
          </Link>
        </div>

        {/* Info */}
        <p className="mt-8 text-sm text-blue-200">
          Hanya admin yang memiliki akses ke dashboard sistem
        </p>
      </div>
    </section>
  );
}
