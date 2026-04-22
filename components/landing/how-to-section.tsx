import { Card } from "@/components/ui/card";
import { Search, CreditCard, Download } from "lucide-react";

export function HowToSection() {
  const steps = [
    {
      number: "1",
      icon: Search,
      title: "Masukkan NIM",
      description: "Ketik Nomor Induk Mahasiswa (NIM) Anda pada kolom yang tersedia",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      number: "2",
      icon: CreditCard,
      title: "Generate KTM",
      description: "Klik tombol 'Generate KTM Saya' dan tunggu beberapa detik",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      number: "3",
      icon: Download,
      title: "Unduh KTM",
      description: "KTM Anda akan muncul, klik tombol 'Unduh KTM' untuk menyimpan",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cara Mendapatkan KTM
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dapatkan Kartu Tanda Mahasiswa digital Anda hanya dalam 3 langkah mudah
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={index}
                className={`relative p-8 ${step.bgColor} border-2 ${step.borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
              >
                {/* Step Number Badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-gray-50">
                  <span className={`text-2xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl mx-auto mb-6 shadow-lg`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (except last card) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            💡 <span className="font-semibold">Tips:</span> Pastikan NIM yang Anda masukkan sudah terdaftar di sistem kampus
          </p>
        </div>
      </div>
    </section>
  );
}
