"use client";

import { useRef, useState } from "react";
import { Download, Loader2, FileImage, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KTMCardFlip } from "@/components/ui/ktm-card-flip";

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

interface KTMGeneratorFlipProps {
  mahasiswa: Mahasiswa;
}

// Helper function to format date
function formatMasaBerlaku(createdAt: string) {
  const baseDate = new Date(createdAt);
  const safeDate = Number.isNaN(baseDate.getTime()) ? new Date() : baseDate;
  const endDate = new Date(safeDate);
  endDate.setFullYear(endDate.getFullYear() + 4);

  const startYear = safeDate.getFullYear();
  const endYear = endDate.getFullYear();

  return `${startYear} - ${endYear}`;
}

export function KTMGeneratorFlip({ mahasiswa }: KTMGeneratorFlipProps) {
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<"front" | "back" | "both">("both");

  const masaBerlaku = formatMasaBerlaku(mahasiswa.created_at);

  // Generate QR Code URL
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${mahasiswa.nim}`;

  const handleDownloadPNG = async (type: "front" | "back" | "both") => {
    setIsDownloading(true);
    setDownloadType(type);

    try {
      const html2canvas = (await import("html2canvas")).default;

      if (type === "both" || type === "front") {
        // Capture front card
        const frontElement = document.querySelector('[data-card-side="front"]') as HTMLElement;
        if (frontElement) {
          const canvas = await html2canvas(frontElement, {
            scale: 3,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
          });

          const link = document.createElement("a");
          link.download = `KTM-${mahasiswa.nim}-${mahasiswa.nama}-DEPAN.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
      }

      if (type === "both" || type === "back") {
        // Wait a bit before capturing back
        await new Promise(resolve => setTimeout(resolve, 500));

        // Capture back card
        const backElement = document.querySelector('[data-card-side="back"]') as HTMLElement;
        if (backElement) {
          const canvas = await html2canvas(backElement, {
            scale: 3,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
          });

          const link = document.createElement("a");
          link.download = `KTM-${mahasiswa.nim}-${mahasiswa.nama}-BELAKANG.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
      }
    } catch (error) {
      console.error("Error generating PNG:", error);
      alert("Gagal mengunduh gambar. Silakan coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      // Create PDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Capture front card
      const frontElement = document.querySelector('[data-card-side="front"]') as HTMLElement;
      if (frontElement) {
        const frontCanvas = await html2canvas(frontElement, {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });

        const imgWidth = 148;
        const imgHeight = (frontCanvas.height * imgWidth) / frontCanvas.width;
        const frontImgData = frontCanvas.toDataURL("image/png");

        pdf.addImage(frontImgData, "PNG", 10, 10, imgWidth, imgHeight);
      }

      // Add new page for back
      pdf.addPage();

      // Capture back card
      const backElement = document.querySelector('[data-card-side="back"]') as HTMLElement;
      if (backElement) {
        const backCanvas = await html2canvas(backElement, {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });

        const imgWidth = 148;
        const imgHeight = (backCanvas.height * imgWidth) / backCanvas.width;
        const backImgData = backCanvas.toDataURL("image/png");

        pdf.addImage(backImgData, "PNG", 10, 10, imgWidth, imgHeight);
      }

      pdf.save(`KTM-${mahasiswa.nim}-${mahasiswa.nama}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Gagal mengunduh PDF. Silakan coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Interactive Card */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-gray-800">
          Preview Kartu (Klik untuk flip)
        </h3>
        <KTMCardFlip
          nama={mahasiswa.nama}
          nim={mahasiswa.nim}
          jurusan={mahasiswa.jurusan}
          masaBerlaku={masaBerlaku}
          fotoUrl={mahasiswa.foto_url}
          qrUrl={qrUrl}
          alamat="Jl. Riau No. 1, Pekanbaru, Riau 28282"
          email="info@lp3i.ac.id"
          website="www.lp3i.ac.id"
          telepon="(0761) 123456"
          autoFlip={false}
        />
      </div>

      {/* Hidden cards for download */}
      <div className="hidden">
        <div data-card-side="front" className="aspect-[1.586/1] w-[900px]">
          <KTMCardFlip
            nama={mahasiswa.nama}
            nim={mahasiswa.nim}
            jurusan={mahasiswa.jurusan}
            masaBerlaku={masaBerlaku}
            fotoUrl={mahasiswa.foto_url}
            qrUrl={qrUrl}
            autoFlip={false}
          />
        </div>
        <div data-card-side="back" className="aspect-[1.586/1] w-[900px]">
          <KTMCardFlip
            nama={mahasiswa.nama}
            nim={mahasiswa.nim}
            jurusan={mahasiswa.jurusan}
            masaBerlaku={masaBerlaku}
            fotoUrl={mahasiswa.foto_url}
            qrUrl={qrUrl}
            autoFlip={false}
          />
        </div>
      </div>

      {/* Download Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Download Kartu</h3>
        
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Download Front PNG */}
          <Button
            onClick={() => handleDownloadPNG("front")}
            disabled={isDownloading}
            variant="outline"
            className="gap-2"
          >
            {isDownloading && downloadType === "front" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mengunduh...
              </>
            ) : (
              <>
                <FileImage className="h-4 w-4" />
                Depan (PNG)
              </>
            )}
          </Button>

          {/* Download Back PNG */}
          <Button
            onClick={() => handleDownloadPNG("back")}
            disabled={isDownloading}
            variant="outline"
            className="gap-2"
          >
            {isDownloading && downloadType === "back" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mengunduh...
              </>
            ) : (
              <>
                <FileImage className="h-4 w-4" />
                Belakang (PNG)
              </>
            )}
          </Button>

          {/* Download Both PNG */}
          <Button
            onClick={() => handleDownloadPNG("both")}
            disabled={isDownloading}
            className="gap-2"
          >
            {isDownloading && downloadType === "both" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mengunduh...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Keduanya (PNG)
              </>
            )}
          </Button>

          {/* Download PDF */}
          <Button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            variant="secondary"
            className="gap-2"
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mengunduh...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                PDF (2 Halaman)
              </>
            )}
          </Button>
        </div>

        <p className="text-sm text-gray-500">
          💡 Tip: Klik kartu di atas untuk melihat sisi depan dan belakang sebelum download
        </p>
      </div>
    </div>
  );
}
