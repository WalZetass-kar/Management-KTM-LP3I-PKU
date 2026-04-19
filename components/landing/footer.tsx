import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { LogoLP3I } from "@/components/ui/logo-lp3i";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#070e1a] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <LogoLP3I variant="colored" size="lg" className="h-14 w-14" />
              <div>
                <h3 className="text-lg font-bold text-white">
                  Politeknik LP3I Pekanbaru
                </h3>
                <p className="text-sm text-[#64748b]">Sistem KTM Digital</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#64748b]">
              Sistem manajemen kartu tanda mahasiswa digital yang modern, aman,
              dan terintegrasi untuk Politeknik LP3I Pekanbaru.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#94a3b8]">
              Tautan Cepat
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="#hero"
                  className="text-sm text-[#64748b] transition hover:text-[#60a5fa]"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="text-sm text-[#64748b] transition hover:text-[#60a5fa]"
                >
                  Fitur
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="text-sm text-[#64748b] transition hover:text-[#60a5fa]"
                >
                  Tentang
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-[#64748b] transition hover:text-[#60a5fa]"
                >
                  Login Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#94a3b8]">
              Kontak
            </h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#475569]" />
                <span className="text-sm text-[#64748b]">
                  Pekanbaru, Riau, Indonesia
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#475569]" />
                <span className="text-sm text-[#64748b]">
                  (0761) 123-4567
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#475569]" />
                <span className="text-sm text-[#64748b]">
                  info@lp3i-pekanbaru.ac.id
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-[#1e293b] pt-8">
          <p className="text-center text-sm text-[#475569]">
            &copy; {currentYear} Politeknik LP3I Pekanbaru. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
