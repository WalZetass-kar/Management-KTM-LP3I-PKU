import { Building2, GraduationCap, Shield, Zap } from "lucide-react";

const highlights = [
  { icon: Zap, label: "Cepat & Efisien" },
  { icon: Shield, label: "Aman & Terenkripsi" },
  { icon: GraduationCap, label: "Terintegrasi Akademik" },
];

export function AboutSection() {
  return (
    <section className="bg-[#f8fafc] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2a74c4]">
              Tentang Sistem
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0f1e36] sm:text-4xl">
              Digitalisasi KTM untuk Kampus Modern
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#475569]">
              Sistem Pembuatan Kartu Tanda Mahasiswa (KTM) Digital adalah solusi
              modern untuk digitalisasi kartu identitas mahasiswa di Politeknik
              LP3I Pekanbaru.
            </p>
            <p className="mt-4 text-base leading-7 text-[#64748b]">
              Dengan sistem ini, proses pembuatan dan verifikasi kartu mahasiswa
              menjadi lebih cepat, efisien, dan aman. Setiap kartu dilengkapi
              dengan QR code unik yang dapat digunakan untuk verifikasi
              identitas secara real-time.
            </p>

            {/* Highlights */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {highlights.map((h) => {
                const Icon = h.icon;
                return (
                  <div
                    key={h.label}
                    className="flex flex-col items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-3 py-4 shadow-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0f2847]/[0.06]">
                      <Icon className="h-5 w-5 text-[#2a74c4]" />
                    </div>
                    <span className="text-center text-xs font-semibold text-[#0f1e36]">
                      {h.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f2847] via-[#1a4a7a] to-[#0a1628] shadow-2xl">
              {/* Hex pattern */}
              <div className="absolute inset-0 opacity-[0.06]">
                <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern
                      id="about-hex"
                      width="56"
                      height="100"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
                        fill="none"
                        stroke="white"
                        strokeWidth="0.8"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#about-hex)" />
                </svg>
              </div>

              <div className="flex h-full items-center justify-center p-12">
                <div className="text-center text-white">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                    <Building2 className="h-10 w-10 opacity-90" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold">
                    Politeknik LP3I Pekanbaru
                  </h3>
                  <p className="mt-4 text-[#93c5fd]">
                    Transformasi Digital Pendidikan
                  </p>
                  <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-[#60a5fa]/40 to-transparent" />
                  <p className="mt-6 text-sm leading-relaxed text-white/60">
                    Mewujudkan ekosistem pendidikan digital yang efisien,
                    terintegrasi, dan berdaya guna tinggi
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-2xl bg-[#2a74c4]/15 blur-sm" />
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-2xl bg-[#60a5fa]/10 blur-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}
