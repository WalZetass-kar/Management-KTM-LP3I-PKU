"use client";
import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Users, ArrowRight, Search, Download, CheckCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoLP3I } from "@/components/ui/logo-lp3i";
import { KTMCardModern } from "@/components/ui/ktm-card-modern";
import { AlumniKTMCard } from "@/components/ui/alumni-ktm-card";

interface StudentData {
  nim: string;
  fullName: string;
  studyProgram: string;
  photoUrl?: string | null;
}

interface AlumniData {
  nim: string;
  fullName: string;
  studyProgram: string;
  graduationYear: string;
  photoUrl?: string | null;
  currentJob?: string | null;
  currentCompany?: string | null;
  location?: string | null;
}

export function MainLandingSection() {
  const [activeTab, setActiveTab] = useState<"mahasiswa" | "alumni">("mahasiswa");
  const [nim, setNim] = useState("");
  const [student, setStudent] = useState<StudentData | null>(null);
  const [alumni, setAlumni] = useState<AlumniData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nim.trim()) return;

    setIsLoading(true);
    setError(null);
    setStudent(null);
    setAlumni(null);

    try {
      const endpoint = activeTab === "mahasiswa" 
        ? `/api/student-ktm?nim=${nim.trim()}`
        : `/api/alumni?nim=${nim.trim()}`;
      
      const response = await fetch(endpoint);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `${activeTab === "mahasiswa" ? "Mahasiswa" : "Alumni"} tidak ditemukan`);
      }

      if (activeTab === "mahasiswa") {
        setStudent(data.student);
      } else {
        setAlumni(data.alumni);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    const cardElement = document.getElementById("ktm-card-preview");
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
      const fileName = activeTab === "mahasiswa" 
        ? `KTM-${student?.nim}.png`
        : `KTM-Alumni-${alumni?.nim}.png`;
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Gagal mengunduh KTM. Silakan coba screenshot manual atau hubungi admin.");
    }
  };

  const resetForm = () => {
    setNim("");
    setStudent(null);
    setAlumni(null);
    setError(null);
  };
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4 py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center space-y-12">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <LogoLP3I size="xl" className="h-24 w-auto" />
          </div>

          {/* Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight">
              Sistem KTM Digital
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
              Politeknik LP3I Pekanbaru
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Generate dan unduh Kartu Tanda Mahasiswa (KTM) digital untuk Mahasiswa Aktif dan Alumni
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex justify-center gap-4 max-w-2xl mx-auto">
            <Button
              onClick={() => {
                setActiveTab("mahasiswa");
                resetForm();
              }}
              className={`flex-1 h-14 text-lg transition-all ${
                activeTab === "mahasiswa"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <GraduationCap className="mr-2 h-5 w-5" />
              Mahasiswa Aktif
            </Button>
            <Button
              onClick={() => {
                setActiveTab("alumni");
                resetForm();
              }}
              className={`flex-1 h-14 text-lg transition-all ${
                activeTab === "alumni"
                  ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <Users className="mr-2 h-5 w-5" />
              Alumni LP3I
            </Button>
          </div>

          {/* Generate KTM Card */}
          <div className="max-w-2xl mx-auto mt-12">
            <Card className={`p-10 bg-white hover:shadow-2xl transition-all duration-300 border-2 ${
              activeTab === "mahasiswa" ? "hover:border-blue-500" : "hover:border-green-500"
            }`}>
              <div className="space-y-6">
                <div className={`flex items-center justify-center w-20 h-20 bg-gradient-to-br ${
                  activeTab === "mahasiswa" 
                    ? "from-blue-500 to-blue-600" 
                    : "from-green-500 to-green-600"
                } rounded-3xl mx-auto shadow-lg`}>
                  <Search className="h-10 w-10 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-gray-900">
                    Generate KTM {activeTab === "mahasiswa" ? "Mahasiswa" : "Alumni"}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Masukkan NIM untuk membuat dan mengunduh KTM {activeTab === "mahasiswa" ? "Mahasiswa" : "Alumni"} Anda
                  </p>
                </div>
                <form onSubmit={handleSearch} className="space-y-4">
                  <Input
                    type="text"
                    placeholder={activeTab === "mahasiswa" ? "Contoh: 2024010101" : "Contoh: 2020010101"}
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    className="text-center text-lg h-14 border-2"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    className={`w-full h-14 text-lg ${
                      activeTab === "mahasiswa"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    }`}
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
                        Generate KTM
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

                {/* Info Tags */}
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activeTab === "mahasiswa"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-green-50 text-green-700"
                  }`}>
                    Input NIM
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activeTab === "mahasiswa"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-green-50 text-green-700"
                  }`}>
                    Generate KTM
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activeTab === "mahasiswa"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-green-50 text-green-700"
                  }`}>
                    Download PNG
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* KTM Preview & Download */}
          {(student || alumni) && (
            <div className="max-w-2xl mx-auto mt-8 space-y-6">
              <Card className={`p-8 bg-white border-2 ${
                activeTab === "mahasiswa" ? "border-blue-200" : "border-green-200"
              }`}>
                <div className="space-y-6">
                  <div className={`flex items-center justify-center gap-2 ${
                    activeTab === "mahasiswa" ? "text-blue-600" : "text-green-600"
                  }`}>
                    <CheckCircle className="h-6 w-6" />
                    <span className="font-semibold text-lg">
                      KTM {activeTab === "mahasiswa" ? "Mahasiswa" : "Alumni"} Berhasil Dibuat!
                    </span>
                  </div>
                  
                  {/* KTM Card Preview */}
                  <div id="ktm-card-preview" className="flex justify-center">
                    {activeTab === "mahasiswa" && student ? (
                      <KTMCardModern 
                        student={{
                          nama: student.fullName,
                          nim: student.nim,
                          jurusan: student.studyProgram,
                          masaBerlaku: `${new Date().getFullYear() + 4}`,
                          fotoUrl: student.photoUrl ?? null,
                        }} 
                      />
                    ) : alumni ? (
                      <AlumniKTMCard 
                        alumni={{
                          nama: alumni.fullName,
                          nim: alumni.nim,
                          jurusan: alumni.studyProgram,
                          tahunLulus: alumni.graduationYear,
                          fotoUrl: alumni.photoUrl ?? null,
                          pekerjaan: alumni.currentJob,
                          perusahaan: alumni.currentCompany,
                          lokasi: alumni.location,
                        }}
                      />
                    ) : null}
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={handleDownload}
                    className={`w-full h-14 text-lg ${
                      activeTab === "mahasiswa"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    }`}
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Unduh KTM
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    KTM akan diunduh dalam format PNG
                  </p>

                  {/* Generate Another */}
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="w-full"
                  >
                    Generate KTM Lainnya
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <Card className="p-8 bg-gradient-to-r from-blue-50 to-green-50 border-0">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
                  <div className="text-gray-600">Mahasiswa Aktif</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
                  <div className="text-gray-600">Alumni Terdaftar</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-600 mb-2">10+</div>
                  <div className="text-gray-600">Program Studi</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
