import { VerificationPanel } from "@/features/verification/components/verification-panel";
import { getMahasiswaByStatus } from "@/lib/mahasiswa";

export const dynamic = "force-dynamic";

interface VerificationPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function VerificationPage({ searchParams }: VerificationPageProps) {
  const resolvedSearchParams = await searchParams;
  
  const mahasiswaResult = await getMahasiswaByStatus("Menunggu");

  const noticeMessage =
    resolvedSearchParams.status === "verified"
      ? "Mahasiswa berhasil diverifikasi."
      : null;

  return (
    <VerificationPanel
      students={mahasiswaResult.data}
      errorMessage={mahasiswaResult.error}
      noticeMessage={noticeMessage}
    />
  );
}
