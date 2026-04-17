import { CreditCard, QrCode, LayoutDashboard, Shield } from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Generate KTM Otomatis",
    description: "Sistem otomatis membuat kartu mahasiswa dengan data yang terintegrasi dan terverifikasi.",
  },
  {
    icon: QrCode,
    title: "Verifikasi dengan QR Code",
    description: "Setiap kartu dilengkapi QR code unik untuk verifikasi cepat dan aman.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard Admin Modern",
    description: "Interface admin yang intuitif untuk mengelola data mahasiswa dengan mudah.",
  },
  {
    icon: Shield,
    title: "Sistem Aman dan Terintegrasi",
    description: "Data mahasiswa tersimpan aman dengan enkripsi dan backup otomatis.",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Fitur Unggulan
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Sistem manajemen KTM yang lengkap dan mudah digunakan
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:border-blue-200 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-900 transition group-hover:bg-blue-900 group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </div>

                {/* Content */}
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
