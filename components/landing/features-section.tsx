import { CreditCard, QrCode, LayoutDashboard, Shield } from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Generate KTM Otomatis",
    description:
      "Sistem otomatis membuat kartu mahasiswa dengan data yang terintegrasi dan terverifikasi.",
    gradient: "from-[#0f2847] to-[#1a4a7a]",
  },
  {
    icon: QrCode,
    title: "Verifikasi dengan QR Code",
    description:
      "Setiap kartu dilengkapi QR code unik untuk verifikasi cepat dan aman.",
    gradient: "from-[#132e52] to-[#2a74c4]",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard Admin Modern",
    description:
      "Interface admin yang intuitif untuk mengelola data mahasiswa dengan mudah.",
    gradient: "from-[#1a4a7a] to-[#3b82f6]",
  },
  {
    icon: Shield,
    title: "Sistem Aman & Terintegrasi",
    description:
      "Data mahasiswa tersimpan aman dengan enkripsi dan backup otomatis.",
    gradient: "from-[#0a1628] to-[#0f2847]",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-[#f8fafc] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2a74c4]">
            Fitur Unggulan
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0f1e36] sm:text-4xl">
            Solusi KTM Digital Terlengkap
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#64748b]">
            Sistem manajemen KTM yang modern, lengkap, dan mudah digunakan
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#2a74c4]/20 hover:shadow-lg hover:shadow-[#2a74c4]/5"
              >
                {/* Icon */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <h3 className="mt-6 text-lg font-semibold text-[#0f1e36]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#64748b]">
                  {feature.description}
                </p>

                {/* Hover accent */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#2a74c4] to-[#60a5fa] transition-all duration-300 group-hover:w-full" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
