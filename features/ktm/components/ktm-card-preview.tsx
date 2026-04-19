"use client";

import Image from "next/image";

interface Mahasiswa {
  id: number;
  nama: string;
  nim: string;
  jurusan: string;
  alamat: string;
  no_hp: string;
  foto_url: string | null;
  status: string;
  created_at: string;
}

interface StudentRecord {
  id: number;
  fullName: string;
  nim: string;
  studyProgram: string;
  status: string;
  photoUrl: string | null;
  address: string;
  phoneNumber: string;
  createdAt: string;
}

interface KtmCardPreviewProps {
  mahasiswa: Mahasiswa | StudentRecord;
}

// Helper function to format date
function formatCardPeriod(createdAt: string, yearOffset = 0) {
  const baseDate = new Date(createdAt);
  const safeDate = Number.isNaN(baseDate.getTime()) ? new Date() : baseDate;
  const nextDate = new Date(safeDate);

  nextDate.setFullYear(nextDate.getFullYear() + yearOffset);

  const month = String(nextDate.getMonth() + 1).padStart(2, "0");
  const year = String(nextDate.getFullYear()).slice(-2);

  return `${month}/${year}`;
}

// Decorative Pattern Component
function DecorativePattern() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full opacity-[0.08]">
      <defs>
        <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="2" fill="white" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#dots)" />
      <circle cx="350" cy="80" r="60" fill="white" opacity="0.05" />
      <circle cx="320" cy="300" r="80" fill="white" opacity="0.03" />
    </svg>
  );
}

export function KtmCardPreview({ mahasiswa }: KtmCardPreviewProps) {
  // Normalize data structure
  const data = {
    nama: 'nama' in mahasiswa ? mahasiswa.nama : mahasiswa.fullName,
    nim: mahasiswa.nim,
    jurusan: 'jurusan' in mahasiswa ? mahasiswa.jurusan : mahasiswa.studyProgram,
    foto_url: 'foto_url' in mahasiswa ? mahasiswa.foto_url : mahasiswa.photoUrl,
    created_at: 'created_at' in mahasiswa ? mahasiswa.created_at : mahasiswa.createdAt,
  };

  const validFrom = formatCardPeriod(data.created_at);
  const validUntil = formatCardPeriod(data.created_at, 4);

  return (
    <div className="w-full">
      {/* Card Container - Redesigned dengan Azure Blue & White */}
      <div className="relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl bg-white shadow-2xl">
        
        {/* Background Gradient - Azure Blue */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0078D4] via-[#0086E7] to-[#00A4EF]">
          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0">
            <DecorativePattern />
          </div>
        </div>

        {/* Top White Section with Logo */}
        <div className="absolute left-0 right-0 top-0 z-20 bg-white px-[4%] py-[2.5%] shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-[3.5rem] w-[3.5rem]">
                <Image
                  src="/images/logo-lp3i.png"
                  alt="Logo LP3I"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-[clamp(1rem,2vw,1.6rem)] font-black uppercase leading-tight tracking-tight text-[#0078D4]">
                  POLITEKNIK LP3I
                </h1>
                <p className="text-[clamp(0.65rem,1.3vw,1rem)] font-bold uppercase tracking-wide text-[#0078D4]/80">
                  KAMPUS PEKANBARU
                </p>
              </div>
            </div>
            <div className="rounded-lg bg-[#0078D4] px-4 py-2">
              <p className="text-[clamp(0.6rem,1.2vw,0.95rem)] font-black uppercase tracking-wider text-white">
                STUDENT ID
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="absolute inset-0 top-[15%] flex">
          
          {/* Left Side - Photo */}
          <div className="flex w-[30%] items-center justify-center p-[3%]">
            <div className="w-full">
              <div className="overflow-hidden rounded-2xl border-[4px] border-white bg-white shadow-2xl">
                {data.foto_url ? (
                  <img
                    src={data.foto_url}
                    alt={data.nama}
                    className="aspect-[3/4] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-[#0078D4] to-[#00A4EF] text-[clamp(3rem,6vw,5rem)] font-black text-white">
                    {data.nama.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Information */}
          <div className="flex w-[70%] flex-col justify-between px-[4%] py-[3%]">
            
            {/* Student Information */}
            <div className="space-y-[3%]">
              
              {/* NIM */}
              <div>
                <p className="text-[clamp(0.6rem,1.1vw,0.85rem)] font-bold uppercase tracking-widest text-white/90">
                  NOMOR INDUK MAHASISWA
                </p>
                <p className="mt-1 text-[clamp(2rem,4vw,3.2rem)] font-black leading-none tracking-tight text-white">
                  {data.nim}
                </p>
              </div>

              {/* Name */}
              <div className="mt-[4%]">
                <p className="text-[clamp(0.6rem,1.1vw,0.85rem)] font-bold uppercase tracking-widest text-white/90">
                  NAMA LENGKAP
                </p>
                <h3 className="mt-1 text-[clamp(1.8rem,3.6vw,2.8rem)] font-black uppercase leading-[0.95] tracking-tight text-white">
                  {data.nama}
                </h3>
              </div>

              {/* Program Study */}
              <div className="mt-[3%]">
                <p className="text-[clamp(0.6rem,1.1vw,0.85rem)] font-bold uppercase tracking-widest text-white/90">
                  PROGRAM STUDI
                </p>
                <p className="mt-1 text-[clamp(1.1rem,2.2vw,1.7rem)] font-bold uppercase tracking-wide text-white">
                  {data.jurusan}
                </p>
              </div>
            </div>

            {/* Validity Period */}
            <div className="mt-auto">
              <div className="flex items-center gap-[8%] rounded-xl bg-white/95 px-[4%] py-[3%] shadow-lg backdrop-blur-sm">
                <div>
                  <p className="text-[clamp(0.55rem,1vw,0.75rem)] font-bold uppercase tracking-wider text-[#0078D4]/70">
                    BERLAKU SEJAK
                  </p>
                  <p className="mt-1 text-[clamp(1.4rem,2.8vw,2.2rem)] font-black leading-none tracking-tight text-[#0078D4]">
                    {validFrom}
                  </p>
                </div>
                <div className="h-[3rem] w-[2px] bg-[#0078D4]/20"></div>
                <div>
                  <p className="text-[clamp(0.55rem,1vw,0.75rem)] font-bold uppercase tracking-wider text-[#0078D4]/70">
                    SAMPAI DENGAN
                  </p>
                  <p className="mt-1 text-[clamp(1.4rem,2.8vw,2.2rem)] font-black leading-none tracking-tight text-[#0078D4]">
                    {validUntil}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1.5%] bg-white"></div>

        {/* Decorative Corner Elements */}
        <div className="absolute right-[5%] top-[20%] h-[8rem] w-[8rem] rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-[15%] right-[8%] h-[6rem] w-[6rem] rounded-full bg-white/5 blur-2xl"></div>
      </div>
    </div>
  );
}
