"use client";

import { useState } from "react";
import { Search, Download, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LogoLP3I } from "@/components/ui/logo-lp3i";

interface AlumniData {
  nim: string;
  fullName: string;
  studyProgram: string;
  graduationYear: string;
  photoUrl?: string;
}

export function AlumniHeroSection() {
  const [nim, setNim] = useState("");
  const [alumni, setAlumni] = useState<AlumniData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nim.trim()) return;

    setIsLoading(true);
    setError(null);
    setAlumni(null);

    try {
      const response = await fetch(`/api/alumni?nim=${nim.trim()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Alumni tidak ditemukan");
      }

      setAlumni(data.alumni);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!alumni) return;
    
    const cardElement = document.getElementById("alumni-card");
    if (!cardElement) return;

    try {
      const domtoimage = await import("dom-to-image-more");
      
      const dataUrl = await domtoimage.toPng(cardElement, {
        quality: 1,
        bgcolor: "#ffffff",
        width: cardElement.offsetWidth * 2,
        height: cardElement.offsetHeight * 2,
        style: {
          transform: "scale(2)",
          transformOrigin: "top left",
        },
      });

      const link = document.createElement("a");
      link.download = `Kartu-Alumni-${alumni.nim}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Gagal mengunduh kartu. Silakan coba screenshot manual atau hubungi admin.");
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-green-50 px-4 py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      {/* Back Button */}
      <div className="max-w-6xl mx-auto w-full mb-8">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto w-full flex-1 flex items-center">
        <div className="w-full space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <LogoLP3I size="xl" className="h-20 w-auto" />
          </div>

          {/* Heading */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight">
              Sistem KTM Digital Alumni LP3I Pekanbaru
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
              Generate dan unduh Kartu Tanda Mahasiswa untuk Alumni
            </p>
          </div>

          {/* Main Search Card */}
          <div className="max-w-2xl mx-auto mt-12">
            <Card className="p-10 bg-white hover:shadow-2xl transition-all duration-300 border-2 hover:border-green-500">
              <div className="space-y-6">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl mx-auto shadow-lg">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-gray-900">Generate KTM Alumni</h3>
                  <p className="text-gray-600 text-lg">
                    Masukkan NIM untuk membuat dan mengunduh KTM Alumni Anda
                  </p>
                </div>
                <form onSubmit={handleSearch} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Contoh: 2020010101"
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    className="text-center text-lg h-14 border-2"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    disabled={!nim.trim() || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-5 w-5" />
                        Generate KTM Alumni
                      </>
                    )}
                  </Button>
                </form>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Alumni Card Preview & Download */}
          {alumni && (
            <div className="max-w-2xl mx-auto mt-8 space-y-6">
              <Card className="p-8 bg-white border-2 border-green-200">
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle className="h-6 w-6" />
                    <span className="font-semibold text-lg">KTM Alumni Berhasil Dibuat!</span>
                  </div>
                  
                  {/* Alumni Card */}
                  <div id="alumni-card" className="flex justify-center">
                    <AlumniKTMCard alumni={alumni} />
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={handleDownload}
                    className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Unduh KTM Alumni
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    KTM akan diunduh dalam format PNG
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Alumni KTM Card Component (sama seperti KTM mahasiswa tapi warna hijau)
function AlumniKTMCard({ alumni }: { alumni: AlumniData }) {
  return (
    <div className="w-[400px] h-[250px] bg-gradient-to-br from-green-600 via-green-500 to-green-400 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <LogoLP3I variant="white" size="md" className="h-12 w-12 mb-2" />
            <div className="text-xs font-semibold opacity-90">POLITEKNIK LP3I</div>
            <div className="text-xs opacity-80">Pekanbaru</div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-80 uppercase">Kartu Alumni</div>
            <div className="text-sm font-bold">Lulus {alumni.graduationYear}</div>
          </div>
        </div>

        {/* Photo & Info */}
        <div className="flex gap-4 flex-1">
          {/* Photo */}
          <div className="w-20 h-24 bg-white rounded-lg overflow-hidden shadow-lg flex-shrink-0">
            {alumni.photoUrl ? (
              <img src={alumni.photoUrl} alt={alumni.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center text-green-700 text-2xl font-bold">
                {alumni.fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-3">
              <div className="text-xs opacity-80 mb-1">Nama</div>
              <div className="text-lg font-bold leading-tight">{alumni.fullName}</div>
            </div>
            <div className="mb-2">
              <div className="text-xs opacity-80 mb-1">Program Studi</div>
              <div className="text-sm font-semibold">{alumni.studyProgram}</div>
            </div>
            <div>
              <div className="text-xs opacity-80 mb-1">NIM</div>
              <div className="text-sm font-mono font-semibold">{alumni.nim}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-white/20 flex justify-between items-center text-xs">
          <div className="opacity-80">Alumni Terverifikasi</div>
          <div className="font-semibold">Tahun Lulus: {alumni.graduationYear}</div>
        </div>
      </div>
    </div>
  );
}
