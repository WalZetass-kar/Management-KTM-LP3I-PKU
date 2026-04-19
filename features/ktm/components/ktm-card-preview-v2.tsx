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

interface KtmCardPreviewV2Props {
  mahasiswa: Mahasiswa | StudentRecord;
}

function formatCardPeriod(createdAt: string, yearOffset = 0) {
  const baseDate = new Date(createdAt);
  const safeDate = Number.isNaN(baseDate.getTime()) ? new Date() : baseDate;
  const nextDate = new Date(safeDate);

  nextDate.setFullYear(nextDate.getFullYear() + yearOffset);

  const month = String(nextDate.getMonth() + 1).padStart(2, "0");
  const year = String(nextDate.getFullYear()).slice(-2);

  return `${month}/${year}`;
}

export function KtmCardPreviewV2({ mahasiswa }: KtmCardPreviewV2Props) {
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
      <div className="relative aspect-[1.586/1] w-full overflow-hidden rounded-xl bg-white shadow-2xl">
        
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Top Bar */}
        <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12">
              <Image
                src="/images/logo-lp3i.png"
                alt="Logo"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase leading-tight text-white">
                POLITEKNIK LP3I
              </h1>
              <p className="text-xs font-semibold uppercase text-white/90">
                Kampus Pekanbaru
              </p>
            </div>
          </div>
          <div className="rounded-md bg-white/20 px-3 py-1 backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              Student ID
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="absolute inset-0 top-[72px] flex">
          
          {/* Photo */}
          <div className="flex w-[32%] items-center justify-center p-6">
            <div className="relative w-full">
              <div className="overflow-hidden rounded-lg border-4 border-white/30 bg-white shadow-2xl">
                {data.foto_url ? (
                  <img
                    src={data.foto_url}
                    alt={data.nama}
                    className="aspect-[3/4] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-6xl font-black text-white">
                    {data.nama.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-amber-500/20 blur-xl"></div>
            </div>
          </div>

          {/* Information */}
          <div className="flex w-[68%] flex-col justify-between p-6 pr-8">
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Nomor Induk Mahasiswa
                </p>
                <p className="mt-1 text-3xl font-black tracking-tight text-white">
                  {data.nim}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Nama Lengkap
                </p>
                <p className="mt-1 text-2xl font-black uppercase leading-tight tracking-tight text-white">
                  {data.nama}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Program Studi
                </p>
                <p className="mt-1 text-lg font-bold uppercase tracking-wide text-white">
                  {data.jurusan}
                </p>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex items-center gap-8 rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                    Berlaku Sejak
                  </p>
                  <p className="mt-0.5 text-xl font-black text-white">
                    {validFrom}
                  </p>
                </div>
                <div className="h-10 w-px bg-white/30"></div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                    Sampai Dengan
                  </p>
                  <p className="mt-0.5 text-xl font-black text-white">
                    {validUntil}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500"></div>

        {/* Decorative */}
        <div className="absolute right-8 top-24 h-32 w-32 rounded-full bg-amber-500/5 blur-3xl"></div>
        <div className="absolute bottom-8 left-1/3 h-24 w-24 rounded-full bg-blue-400/5 blur-2xl"></div>
      </div>
    </div>
  );
}
