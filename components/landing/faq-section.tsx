"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "Bagaimana cara mendapatkan KTM digital?",
      answer: "Cukup masukkan NIM Anda pada kolom yang tersedia di halaman utama, klik tombol 'Generate KTM Saya', dan KTM digital Anda akan muncul. Setelah itu, Anda bisa mengunduhnya dengan klik tombol 'Unduh KTM'.",
    },
    {
      question: "Apa yang harus dilakukan jika NIM tidak ditemukan?",
      answer: "Jika NIM Anda tidak ditemukan, pastikan Anda sudah terdaftar sebagai mahasiswa aktif. Jika masih bermasalah, hubungi bagian administrasi kampus atau admin sistem untuk memverifikasi data Anda.",
    },
    {
      question: "Berapa lama masa berlaku KTM digital?",
      answer: "KTM digital berlaku selama Anda masih berstatus sebagai mahasiswa aktif di Politeknik LP3I. Masa berlaku akan tercantum pada kartu yang di-generate.",
    },
    {
      question: "Apakah KTM digital ini resmi dan sah?",
      answer: "Ya, KTM digital ini resmi dikeluarkan oleh Politeknik LP3I dan data diambil langsung dari database kampus. KTM ini dapat digunakan untuk keperluan akademik dan administrasi kampus.",
    },
    {
      question: "Bisakah saya generate KTM berkali-kali?",
      answer: "Ya, Anda bisa generate KTM kapan saja sesuai kebutuhan. Setiap kali generate, data yang ditampilkan adalah data terbaru dari sistem.",
    },
    {
      question: "Format file apa yang dihasilkan saat download?",
      answer: "KTM akan diunduh dalam format PNG (gambar) dengan kualitas tinggi, sehingga bisa langsung digunakan atau dicetak jika diperlukan.",
    },
    {
      question: "Apakah data saya aman?",
      answer: "Ya, sistem kami menggunakan enkripsi dan keamanan tingkat tinggi. Data Anda hanya digunakan untuk generate KTM dan tidak akan disalahgunakan.",
    },
    {
      question: "Siapa yang bisa saya hubungi jika ada masalah?",
      answer: "Jika mengalami kendala, Anda bisa menghubungi bagian administrasi kampus atau IT support melalui kontak yang tersedia di footer halaman ini.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="h-10 w-10 text-blue-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              FAQ
            </h2>
          </div>
          <p className="text-xl text-gray-600">
            Pertanyaan yang Sering Diajukan
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="overflow-hidden border-2 hover:border-blue-200 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t pt-4">
                  {faq.answer}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center p-6 bg-blue-50 rounded-2xl border-2 border-blue-100">
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Masih ada pertanyaan?</span>
          </p>
          <p className="text-gray-600 text-sm">
            Hubungi kami melalui kontak yang tersedia di bagian bawah halaman
          </p>
        </div>
      </div>
    </section>
  );
}
