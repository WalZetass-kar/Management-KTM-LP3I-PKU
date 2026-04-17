import Link from "next/link";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Politeknik LP3I Pekanbaru
                </h3>
                <p className="text-sm text-gray-400">Sistem KTM Digital</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-400">
              Sistem manajemen kartu tanda mahasiswa digital yang modern, aman, 
              dan terintegrasi untuk Politeknik LP3I Pekanbaru.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Tautan Cepat
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="#hero"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Fitur
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Tentang
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Login Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Kontak
            </h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <span className="text-sm text-gray-400">
                  Pekanbaru, Riau, Indonesia
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <span className="text-sm text-gray-400">
                  (0761) 123-4567
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <span className="text-sm text-gray-400">
                  info@lp3i-pekanbaru.ac.id
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {currentYear} Politeknik LP3I Pekanbaru. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
