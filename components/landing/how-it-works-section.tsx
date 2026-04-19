import { Search, CheckCircle, Download } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Masukkan NIM",
    description: "Input nomor induk mahasiswa Anda di kolom pencarian pada halaman utama",
  },
  {
    icon: CheckCircle,
    title: "Data Diverifikasi",
    description: "Sistem memverifikasi data mahasiswa secara real-time dari database kampus",
  },
  {
    icon: Download,
    title: "KTM Siap Diunduh",
    description: "Kartu mahasiswa digital Anda siap dilihat, dibalik, dan diunduh dalam format PDF",
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2a74c4]">
            Cara Kerja
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0f1e36] sm:text-4xl">
            Tiga Langkah Mudah
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#64748b]">
            Proses sederhana untuk mendapatkan kartu mahasiswa digital Anda
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16">
          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative">
                  {/* Connector Line (desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-1/2 top-14 hidden h-0.5 w-full bg-gradient-to-r from-[#0f2847] to-[#2a74c4]/40 lg:block" />
                  )}

                  {/* Step Card */}
                  <div className="group relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#0f2847] to-[#1a4a7a] text-sm font-bold text-white shadow-lg">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f2847]/[0.06] text-[#0f2847] transition-all duration-300 group-hover:bg-[#0f2847] group-hover:text-white group-hover:shadow-lg">
                      <Icon className="h-7 w-7" />
                    </div>

                    {/* Content */}
                    <h3 className="mt-6 text-xl font-semibold text-[#0f1e36]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[#64748b]">
                      {step.description}
                    </p>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#2a74c4] to-[#60a5fa] transition-all duration-300 group-hover:w-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
