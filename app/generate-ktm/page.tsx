import { KtmGeneratorModern } from "@/features/ktm/components/ktm-generator-modern";
import { getMahasiswaList } from "@/lib/mahasiswa";
import { getMahasiswaByAngkatan, getAvailableAngkatan } from "@/lib/mahasiswa-angkatan";

export const dynamic = "force-dynamic";

interface GenerateKtmPageProps {
  searchParams: Promise<{
    angkatan?: string;
    source?: string; // 'mahasiswa' or 'angkatan'
  }>;
}

export default async function GenerateKtmPage({ searchParams }: GenerateKtmPageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedAngkatan = resolvedSearchParams.angkatan || "2025";
  const source = resolvedSearchParams.source || "angkatan";

  let studentsResult;
  let angkatanResult;

  if (source === "angkatan") {
    // Get data from mahasiswa_angkatan table
    const [mahasiswaAngkatanResult, availableAngkatanResult] = await Promise.all([
      getMahasiswaByAngkatan(selectedAngkatan),
      getAvailableAngkatan(),
    ]);

    // Convert mahasiswa_angkatan format to StudentRecord format
    studentsResult = {
      data: mahasiswaAngkatanResult.data.map(student => ({
        id: student.id,
        fullName: student.fullName,
        nim: student.nim,
        studyProgram: student.studyProgram,
        status: student.status,
        photoUrl: student.photoUrl,
        address: student.address,
        phoneNumber: student.phoneNumber,
        createdAt: student.createdAt,
      })),
      error: mahasiswaAngkatanResult.error,
    };

    angkatanResult = availableAngkatanResult;
  } else {
    // Fallback to original mahasiswa table
    studentsResult = await getMahasiswaList();
    angkatanResult = { data: [new Date().getFullYear().toString()], error: null };
  }

  return (
    <KtmGeneratorModern
      students={studentsResult.data}
      availableAngkatan={angkatanResult.data}
      currentAngkatan={selectedAngkatan}
      source={source}
      errorMessage={studentsResult.error || angkatanResult.error}
    />
  );
}
