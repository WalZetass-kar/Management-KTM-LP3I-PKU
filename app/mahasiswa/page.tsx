import { StudentDirectory } from "@/features/students/components/student-directory";
import { getMahasiswaList } from "@/lib/mahasiswa";

interface StudentsPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
  const [{ data, error }, resolvedSearchParams] = await Promise.all([
    getMahasiswaList(),
    searchParams,
  ]);

  const noticeMessage =
    resolvedSearchParams.status === "created"
      ? "Mahasiswa baru berhasil ditambahkan."
      : resolvedSearchParams.status === "updated"
      ? "Data mahasiswa berhasil diperbarui."
      : null;

  return (
    <StudentDirectory
      students={data}
      errorMessage={error}
      noticeMessage={noticeMessage}
    />
  );
}
