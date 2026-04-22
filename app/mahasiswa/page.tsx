import { StudentDirectory } from "@/features/students/components/student-directory";
import { getMahasiswaList, getMahasiswaByFilter, getAvailableAngkatanFromMahasiswa } from "@/lib/mahasiswa";
import { getJurusanList } from "@/lib/jurusan";

interface StudentsPageProps {
  searchParams: Promise<{
    status?: string;
    angkatan?: string;
    search?: string;
    jurusan?: string;
  }>;
}

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
  const resolvedSearchParams = await searchParams;
  
  // Get available angkatan, jurusan, and filtered data
  const [angkatanResult, jurusanResult, mahasiswaResult] = await Promise.all([
    getAvailableAngkatanFromMahasiswa(),
    getJurusanList(),
    resolvedSearchParams.angkatan || resolvedSearchParams.search || resolvedSearchParams.jurusan
      ? getMahasiswaByFilter({
          angkatan: resolvedSearchParams.angkatan,
          search: resolvedSearchParams.search,
          jurusan: resolvedSearchParams.jurusan,
        })
      : getMahasiswaList(),
  ]);

  const noticeMessage =
    resolvedSearchParams.status === "created"
      ? "Mahasiswa baru berhasil ditambahkan."
      : resolvedSearchParams.status === "updated"
      ? "Data mahasiswa berhasil diperbarui."
      : null;

  return (
    <StudentDirectory
      students={mahasiswaResult.data}
      availableAngkatan={angkatanResult.data}
      availableJurusan={jurusanResult.data}
      currentFilters={{
        angkatan: resolvedSearchParams.angkatan || "",
        search: resolvedSearchParams.search || "",
        jurusan: resolvedSearchParams.jurusan || "",
      }}
      errorMessage={mahasiswaResult.error || angkatanResult.error || jurusanResult.error}
      noticeMessage={noticeMessage}
    />
  );
}
