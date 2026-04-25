"use client";

import { useState } from "react";
import { Search, Download, CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LogoLP3I } from "@/components/ui/logo-lp3i";
import { KTMCardModern } from "@/components/ui/ktm-card-modern";
import type { StudentRecord } from "@/types/student";

export function HeroSection() {
  const [nim, setNim] = useState("");
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nim.trim()) return;

    setIsLoading(true);
    setError(null);
    setStudent(null);

    try {
      const response = await fetch(`/api/student-ktm?nim=${nim.trim()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Mahasiswa tidak ditemukan");
      }

      setStudent(data.student);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!student) return;
    
    const ktmElement = document.getElementById("ktm-card");
    if (!ktmElement) return;

    try {
      // Use dom-to-image-more for better compatibility
      const domtoimage = await import("dom-to-image-more");
      
      const dataUrl = await domtoimage.toPng(ktmElement, {
        quality: 1,
        bgcolor: "#ffffff",
        width: ktmElement.offsetWidth * 2,
        height: ktmElement.offsetHeight * 2,
        style: {
          transform: "scale(2)",
          transformOrigin: "top left",
        },
      });

      const link = document.createElement("a");
      link.download = `KTM-${student.nim}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Gagal mengunduh KTM. Silakan coba screenshot manual atau hubungi admin.");
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4 py-20">
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
              Sistem KTM Digital Politeknik LP3I Pekanbaru
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
              Generate dan unduh Kartu Tanda Mahasiswa Anda secara digital
            </p>
          </div>

          {/* Main Search Card */}
          <div className="max-w-2xl mx-auto mt-12">
            <Card className="p-10 bg-white hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-500">
              <div className="space-y-6">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl mx-auto shadow-lg">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-gray-900">Generate KTM</h3>
                  <p className="text-gray-600 text-lg">
                    Masukkan NIM untuk membuat dan mengunduh Kartu Tanda Mahasiswa Anda
                  </p>
                </div>
                <form onSubmit={handleSearch} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Contoh: 2024010101"
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    className="text-center text-lg h-14 border-2"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
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
                        Generate KTM Saya
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

          {/* KTM Preview & Download */}
          {student && (
            <div className="max-w-2xl mx-auto mt-8 space-y-6">
              <Card className="p-8 bg-white border-2 border-green-200">
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle className="h-6 w-6" />
                    <span className="font-semibold text-lg">KTM Berhasil Dibuat!</span>
                  </div>
                  
                  {/* KTM Card */}
                  <div id="ktm-card" className="flex justify-center">
                    <KTMCardModern 
                      student={{
                        nama: student.fullName,
                        nim: student.nim,
                        jurusan: student.studyProgram,
                        masaBerlaku: `${new Date().getFullYear() + 4}`,
                        fotoUrl: student.photoUrl,
                      }} 
                    />
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={handleDownload}
                    className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Unduh KTM
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
