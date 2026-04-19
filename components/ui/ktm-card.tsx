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
    berlaku: string; // Format: MM/YY
    sampai: string;  // Format: MM/YY
  };
}

// Globe/World Decoration Component
function GlobeDecoration() {
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full">
      <g fill="none" stroke="#d0e5ea" strokeWidth="1" opacity="0.2">
        <circle cx="150" cy="150" r="110" />
        <ellipse cx="150" cy="150" rx="110" ry="55" />
        <ellipse cx="150" cy="150" rx="55" ry="110" />
        <line x1="40" y1="150" x2="260" y2="150" />
        <line x1="150" y1="40" x2="150" y2="260" />
        <path d="M 150 40 Q 175 95 150 150 Q 125 205 150 260" />
        <path d="M 150 40 Q 125 95 150 150 Q 175 205 150 260" />
        <ellipse cx="150" cy="150" rx="85" ry="42" />
        <ellipse cx="150" cy="150" rx="42" ry="85" />
      </g>
    </svg>
  );
}

export function KTMCard({ data }: KTMCardProps) {
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
      <div
        ref={cardRef}
        className="group relative aspect-[1.586/1] w-full max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]"
      >
        {/* Header Section */}
        <div className="absolute left-0 right-0 top-0 z-20 h-[18%]">
          <div className="absolute inset-0 bg-[#0a5278]" />

          {/* Wave transition */}
          <div className="absolute right-0 top-0 h-full w-[58%]">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
              <path 
                d="M 0 0 L 100 0 L 100 100 Q 80 60, 60 50 Q 40 40, 20 55 Q 10 65, 0 100 Z" 
                fill="#e5e7eb" 
              />
            </svg>
          </div>

          {/* Yellow accent */}
          <div className="absolute right-0 top-0 h-full w-[32%]">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
              <path 
                d="M 25 0 L 100 0 L 100 100 Q 75 70, 50 75 Q 30 78, 15 90 L 0 100 Q 10 60, 25 0 Z" 
                fill="#f59e0b" 
              />
            </svg>
          </div>

          {/* Header content */}
          <div className="relative z-10 flex h-full items-center px-[3%]">
            <div className="relative h-[68%] w-auto aspect-square">
              <Image
                src="/images/logo-lp3i.png"
                alt="Logo LP3I"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <div className="ml-3">
              <h1 className="text-[clamp(0.95rem,1.9vw,1.5rem)] font-black uppercase leading-tight tracking-wide text-white drop-shadow-md">
                STUDENT ID CARD
              </h1>
              <p className="text-[clamp(0.5rem,1vw,0.8rem)] font-bold uppercase tracking-wider text-white/95 drop-shadow-sm">
                POLITEKNIK LP3I BANDUNG KAMPUS PEKANBARU
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="absolute inset-0 top-[18%] bg-gradient-to-br from-[#f3f4f6] via-white to-[#f9fafb]">
          <div className="relative flex h-full">
            
            {/* Globe decoration */}
            <div className="absolute right-[1%] top-[3%] h-[68%] w-[34%] opacity-50">
              <GlobeDecoration />
            </div>

            {/* Photo section */}
            <div className="relative z-10 flex w-[28%] items-center justify-center px-[2%] py-[3%]">
              <div className="w-full">
                <div className="overflow-hidden rounded-[1.2rem] border-[3.5px] border-[#0ea5e9] bg-[#0ea5e9] shadow-xl">
                  {data.foto ? (
                    <img
                      src={data.foto}
                      alt={data.nama}
                      className="aspect-[3/4] w-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-[#0ea5e9] to-[#0a5278] text-[clamp(2.5rem,5vw,4rem)] font-black text-white">
                      {data.nama.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Information section */}
            <div className="relative z-10 flex w-[72%] flex-col justify-between px-[3%] py-[3%]">
              
              {/* Logo & Institution */}
              <div className="flex items-center gap-3">
                <div className="relative h-[3.8rem] w-[3.8rem] shrink-0">
                  <Image
                    src="/images/logo-lp3i.png"
                    alt="Logo LP3I"
                    fill
                    className="object-contain drop-shadow-md"
                  />
                </div>
                <div className="border-l-[3px] border-[#0a5278]/30 pl-3">
                  <h2 className="text-[clamp(0.85rem,1.7vw,1.35rem)] font-black uppercase leading-tight text-[#0a5278]">
                    POLITEKNIK LP3I
                  </h2>
                  <p className="text-[clamp(0.75rem,1.5vw,1.2rem)] font-black uppercase leading-tight text-[#0a5278]">
                    KAMPUS PEKANBARU
                  </p>
                </div>
              </div>

              {/* NIM */}
              <div className="mt-[4%]">
                <p className="text-[clamp(0.6rem,1.1vw,0.85rem)] font-bold uppercase tracking-wider text-[#0ea5e9]">
                  NIM :
                </p>
                <p className="mt-0.5 text-[clamp(1.8rem,3.6vw,2.8rem)] font-black leading-none tracking-tight text-[#0a5278]">
                  {data.nim}
                </p>
              </div>

              {/* Name & Program */}
              <div className="mt-[5%]">
                <h3 className="text-[clamp(1.6rem,3.2vw,2.5rem)] font-black uppercase leading-[0.95] tracking-tight text-[#0a5278]">
                  {data.nama}
                </h3>
                <p className="mt-2 text-[clamp(0.9rem,1.8vw,1.4rem)] font-bold uppercase tracking-wide text-[#dc2626]">
                  {data.prodi}
                </p>
              </div>

              {/* Validity */}
              <div className="mt-auto flex items-end gap-[12%] pb-[2%] pt-[4%]">
                <div>
                  <p className="text-[clamp(0.55rem,1vw,0.8rem)] font-semibold uppercase leading-tight tracking-wide text-[#0ea5e9]">
                    BERLAKU
                  </p>
                  <p className="text-[clamp(0.55rem,1vw,0.8rem)] font-semibold uppercase leading-tight tracking-wide text-[#0ea5e9]">
                    SEJAK
                  </p>
                  <p className="mt-1 text-[clamp(1.2rem,2.3vw,1.8rem)] font-black leading-none tracking-tight text-[#0ea5e9]">
                    {data.berlaku}
                  </p>
                </div>
                <div>
                  <p className="text-[clamp(0.55rem,1vw,0.8rem)] font-semibold uppercase leading-tight tracking-wide text-[#0ea5e9]">
                    SAMPAI
                  </p>
                  <p className="text-[clamp(0.55rem,1vw,0.8rem)] font-semibold uppercase leading-tight tracking-wide text-[#0ea5e9]">
                    DENGAN
                  </p>
                  <p className="mt-1 text-[clamp(1.2rem,2.3vw,1.8rem)] font-black leading-none tracking-tight text-[#0ea5e9]">
                    {data.sampai}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer waves */}
        <div className="absolute bottom-0 left-0 z-20 h-[9%] w-[18%]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
            <path 
              d="M 0 100 L 0 35 Q 20 25, 40 28 Q 60 32, 80 25 Q 90 20, 100 15 L 100 100 Z" 
              fill="#f59e0b" 
            />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 z-20 h-[9%] w-[28%]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
            <path 
              d="M 100 100 L 100 30 Q 80 35, 60 32 Q 40 29, 20 35 Q 10 38, 0 48 L 0 100 Z" 
              fill="#0a5278" 
            />
          </svg>
        </div>
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
