import { Search, CheckCircle, Download } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Masukkan NIM",
    description: "Input nomor induk mahasiswa Anda di kolom pencarian",
  },
  {
    icon: CheckCircle,
    title: "Data Diverifikasi",
    description: "Sistem memverifikasi data mahasiswa dari database",
  },
  {
    icon: Download,
    title: "KTM Ditampilkan",
    description: "Kartu mahasiswa Anda siap dilihat dan diunduh",
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Cara Kerja
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Proses sederhana untuk mendapatkan kartu mahasiswa Anda
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
                    <div className="absolute left-1/2 top-14 hidden h-0.5 w-full bg-gradient-to-r from-blue-900 to-blue-600 lg:block" />
                  )}

                  {/* Step Card */}
                  <div className="relative rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 text-sm font-bold text-white shadow-lg">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div className="mt-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-900">
                      <Icon className="h-8 w-8" />
                    </div>

                    {/* Content */}
                    <h3 className="mt-6 text-xl font-semibold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {step.description}
                    </p>
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
