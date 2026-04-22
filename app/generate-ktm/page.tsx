import { KtmGeneratorModern } from "@/features/ktm/components/ktm-generator-modern";
import { getMahasiswaByAngkatan, getAvailableAngkatan } from "@/lib/mahasiswa-angkatan";
import type { StudentRecord } from "@/types/student";

export const dynamic = "force-dynamic";

interface GenerateKtmPageProps {
  searchParams: Promise<{
    angkatan?: string;
  }>;
}

export default async function GenerateKtmPage({ searchParams }: GenerateKtmPageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedAngkatan = resolvedSearchParams.angkatan || "2025";

  // Get data from unified mahasiswa table (via mahasiswa-angkatan lib)
  const [mahasiswaResult, availableAngkatanResult] = await Promise.all([
    getMahasiswaByAngkatan(selectedAngkatan),
    getAvailableAngkatan(),
  ]);

  // Convert to StudentRecord format
  const studentsResult: { data: StudentRecord[]; error: string | null } = {
    data: mahasiswaResult.data.map(student => ({
      id: student.id,
      fullName: student.fullName,
      nim: student.nim,
      studyProgram: student.studyProgram,
      status: student.status as any,
      photoUrl: student.photoUrl || null,
      address: student.address,
      phoneNumber: student.phoneNumber,
      angkatan: student.angkatan,
      createdAt: student.createdAt,
    })),
    error: mahasiswaResult.error,
  };

  return (
    <KtmGeneratorModern
      students={studentsResult.data}
      availableAngkatan={availableAngkatanResult.data}
      currentAngkatan={selectedAngkatan}
      errorMessage={studentsResult.error || availableAngkatanResult.error}
    />
  );
}
