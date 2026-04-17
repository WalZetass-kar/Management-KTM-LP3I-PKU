import { Building2 } from "lucide-react";

export function AboutSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tentang Sistem KTM
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Sistem Pembuatan Kartu Tanda Mahasiswa (KTM) Digital adalah solusi modern untuk 
              digitalisasi kartu identitas mahasiswa di Politeknik LP3I Pekanbaru.
            </p>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Dengan sistem ini, proses pembuatan dan verifikasi kartu mahasiswa menjadi lebih 
              cepat, efisien, dan aman. Setiap kartu dilengkapi dengan QR code unik yang dapat 
              digunakan untuk verifikasi identitas secara real-time.
            </p>
          </div>

          {/* Right Image/Illustration */}
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 to-blue-700 shadow-2xl">
              <div className="flex h-full items-center justify-center p-12">
                <div className="text-center text-white">
                  <Building2 className="mx-auto h-24 w-24 opacity-80" />
                  <h3 className="mt-6 text-2xl font-bold">
                    Politeknik LP3I Pekanbaru
                  </h3>
                  <p className="mt-4 text-blue-100">
                    Transformasi Digital Pendidikan
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-3xl bg-blue-200 opacity-50" />
            <div className="absolute -left-6 -top-6 h-32 w-32 rounded-3xl bg-blue-300 opacity-30" />
          </div>
        </div>
      </div>
    </section>
  );
}
