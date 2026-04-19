"use client";

import { useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KTMCardModern } from "@/components/ui/ktm-card-modern";

interface MahasiswaData {
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

interface KtmPreviewModernProps {
  mahasiswa: MahasiswaData;
}

function formatMasaBerlaku(createdAt: string) {
  const base = new Date(createdAt);
  const safe = Number.isNaN(base.getTime()) ? new Date() : base;
  const end = new Date(safe);
  end.setFullYear(end.getFullYear() + 4);
  return `${safe.getFullYear()} - ${end.getFullYear()}`;
}

export function KtmPreviewModern({ mahasiswa }: KtmPreviewModernProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const studentData = {
    nama: mahasiswa.nama,
    nim: mahasiswa.nim,
    jurusan: mahasiswa.jurusan,
    masaBerlaku: formatMasaBerlaku(mahasiswa.created_at),
    fotoUrl: mahasiswa.foto_url,
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mahasiswa.nim)}`;

  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      // Capture front
      const frontEl = document.querySelector(
        '[data-ktm-landing="front"]'
      ) as HTMLElement;
      const backEl = document.querySelector(
        '[data-ktm-landing="back"]'
      ) as HTMLElement;

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      if (frontEl) {
        const canvas = await html2canvas(frontEl, {
          scale: 4,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });
        const imgWidth = 170;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          (297 - imgWidth) / 2,
          (210 - imgHeight) / 2,
          imgWidth,
          imgHeight
        );
      }

      pdf.addPage();

      if (backEl) {
        const canvas = await html2canvas(backEl, {
          scale: 4,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });
        const imgWidth = 170;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          (297 - imgWidth) / 2,
          (210 - imgHeight) / 2,
          imgWidth,
          imgHeight
        );
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mx-auto w-full max-w-2xl space-y-5">
        {/* Interactive card */}
        <KTMCardModern
          student={studentData}
          qrUrl={qrUrl}
          mode="flip"
          showFlipHint
        />

        {/* Download button */}
        <div className="flex justify-center">
          <Button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            size="lg"
            className="gap-2 bg-white px-8 text-base font-semibold text-[#0f2847] shadow-xl hover:bg-blue-50"
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Mengunduh PDF...
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Unduh KTM (PDF)
              </>
            )}
          </Button>
        </div>

        {/* Hidden render targets */}
        <div className="pointer-events-none fixed left-[-9999px] top-0">
          <div data-ktm-landing="front" className="w-[900px]">
            <KTMCardModern
              student={studentData}
              qrUrl={qrUrl}
              mode="front-only"
              showFlipHint={false}
            />
          </div>
          <div data-ktm-landing="back" className="w-[900px]">
            <KTMCardModern
              student={studentData}
              qrUrl={qrUrl}
              mode="back-only"
              showFlipHint={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
