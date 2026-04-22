import { LogoLP3I } from "@/components/ui/logo-lp3i";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo & About */}
          <div className="md:col-span-2 space-y-4">
            <LogoLP3I size="lg" variant="white" />
            <h3 className="text-xl font-bold text-white mt-4">
              Politeknik LP3I Pekanbaru
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Lembaga Pendidikan dan Pengembangan Profesi Indonesia (LP3I) adalah institusi pendidikan vokasi terkemuka yang fokus pada pengembangan SDM profesional dan siap kerja.
            </p>
            <div className="flex gap-4 pt-4">
              <a 
                href="https://lp3ipekanbaru.ac.id" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-6">Kontak</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">
                    Jl. Taman Sari No.11,<br />
                   Tengkerag Sel. Kec. Bukit Raya, Kota Pekanbaru, Riau 28125
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <p className="text-sm text-gray-400">
                  085265866661
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <p className="text-sm text-gray-400">
                  lp3ipekanbaru11@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-6">Layanan</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="/verifikasi" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  Comming Soon
                </a>
              </li>
              <li>
                <a 
                  href="https://lp3i.ac.id" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  Comming Soon
                </a>
              </li>
              <li>
                <a 
                  href="https://lp3i.ac.id/program-studi" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  Comming Soon
                </a>
              </li>
              <li>
                <a 
                  href="https://lp3i.ac.id/pendaftaran" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  Comming Soon
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} Politeknik LP3I. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Kebijakan Privasi
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Syarat & Ketentuan
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
