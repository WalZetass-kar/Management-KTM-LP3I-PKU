import { MahasiswaAngkatanDirectory } from "@/features/mahasiswa-angkatan/components/mahasiswa-angkatan-directory";
import { getMahasiswaByAngkatan, getAvailableAngkatan } from "@/lib/mahasiswa-angkatan";

export const dynamic = "force-dynamic";

interface MahasiswaAngkatanPageProps {
  searchParams: Promise<{
    angkatan?: string;
    search?: string;
    jurusan?: string;
    status?: string;
  }>;
}

export default async function MahasiswaAngkatanPage({ searchParams }: MahasiswaAngkatanPageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedAngkatan = resolvedSearchParams.angkatan || "2025";
  const searchQuery = resolvedSearchParams.search || "";
  const jurusanFilter = resolvedSearchParams.jurusan || "";
  const statusFilter = resolvedSearchParams.status || "";

  const [mahasiswaResult, angkatanResult] = await Promise.all([
    getMahasiswaByAngkatan(selectedAngkatan, searchQuery, jurusanFilter, statusFilter),
    getAvailableAngkatan(),
  ]);

  return (
    <MahasiswaAngkatanDirectory
      mahasiswa={mahasiswaResult.data}
      availableAngkatan={angkatanResult.data}
      currentAngkatan={selectedAngkatan}
      searchQuery={searchQuery}
      jurusanFilter={jurusanFilter}
      statusFilter={statusFilter}
      errorMessage={mahasiswaResult.error || angkatanResult.error}
    />
  );
}