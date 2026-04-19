"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KTMCardProps {
  data: {
    nama: string;
    nim: string;
    prodi: string;
    foto: string | null;
    berlaku: string;
    sampai: string;
  };
}

export function KTMCardV2({ data }: KTMCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `KTM-${data.nim}-${data.nama}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error generating PNG:", error);
      alert("Gagal mengunduh gambar. Silakan coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Card Container - Redesigned Azure Blue & White */}
      <div
        ref={cardRef}
        className="group relative aspect-[1.586/1] w-full max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 hover:shadow-3xl"
      >
        {/* Background - Azure Blue Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0078D4] via-[#0086E7] to-[#00A4EF]">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-[0.08]">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots-v2" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots-v2)" />
            </svg>
          </div>
        </div>

        {/* Top White Section */}
        <div className="absolute left-0 right-0 top-0 z-20 bg-white px-6 py-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14">
                <Image
                  src="/images/logo-lp3i.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-base font-black uppercase leading-tight tracking-tight text-[#0078D4]">
                  POLITEKNIK LP3I
                </h1>
                <p className="text-xs font-bold uppercase tracking-wide text-[#0078D4]/80">
                  KAMPUS PEKANBARU
                </p>
              </div>
            </div>
            <div className="rounded-lg bg-[#0078D4] px-4 py-2">
              <p className="text-xs font-black uppercase tracking-wider text-white">
                STUDENT ID
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="absolute inset-0 top-[72px] flex">
          
          {/* Left Side - Photo */}
          <div className="flex w-[30%] items-center justify-center p-6">
            <div className="relative w-full">
              <div className="overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl">
                {data.foto ? (
                  <img
                    src={data.foto}
                    alt={data.nama}
                    className="aspect-[3/4] w-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-[#0078D4] to-[#00A4EF] text-6xl font-black text-white">
                    {data.nama.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Information */}
          <div className="flex w-[70%] flex-col justify-between p-6 pr-8">
            
            {/* Student Info */}
            <div className="space-y-4">
              {/* NIM */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/90">
                  NOMOR INDUK MAHASISWA
                </p>
                <p className="mt-1 text-4xl font-black tracking-tight text-white">
                  {data.nim}
                </p>
              </div>

              {/* Name */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/90">
                  NAMA LENGKAP
                </p>
                <p className="mt-1 text-3xl font-black uppercase leading-tight tracking-tight text-white">
                  {data.nama}
                </p>
              </div>

              {/* Program */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/90">
                  PROGRAM STUDI
                </p>
                <p className="mt-1 text-xl font-bold uppercase tracking-wide text-white">
                  {data.prodi}
                </p>
              </div>
            </div>

            {/* Validity Period */}
            <div className="mt-auto">
              <div className="flex items-center gap-8 rounded-xl bg-white/95 px-5 py-4 shadow-lg backdrop-blur-sm">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#0078D4]/70">
                    BERLAKU SEJAK
                  </p>
                  <p className="mt-1 text-2xl font-black text-[#0078D4]">
                    {data.berlaku}
                  </p>
                </div>
                <div className="h-12 w-[2px] bg-[#0078D4]/20"></div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#0078D4]/70">
                    SAMPAI DENGAN
                  </p>
                  <p className="mt-1 text-2xl font-black text-[#0078D4]">
                    {data.sampai}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom White Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-white"></div>

        {/* Decorative Elements */}
        <div className="absolute right-12 top-28 h-32 w-32 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-16 right-16 h-24 w-24 rounded-full bg-white/5 blur-2xl"></div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleDownloadPNG}
          disabled={isDownloading}
          size="lg"
          className="gap-2 px-8 shadow-lg transition-all hover:scale-105"
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Mengunduh...
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              Download PNG
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
