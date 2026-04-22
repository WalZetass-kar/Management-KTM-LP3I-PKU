import { notFound } from "next/navigation";
import { StudentForm } from "@/features/students/components/student-form";
import { getMahasiswaById } from "@/lib/mahasiswa";
import { getJurusanList } from "@/lib/jurusan";
import { getAngkatanList } from "@/lib/angkatan";

interface EditStudentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  const { id } = await params;
  const studentId = Number(id);

  if (!Number.isFinite(studentId)) {
    notFound();
  }

  const [{ data: student }, jurusanResult, angkatanResult] = await Promise.all([
    getMahasiswaById(studentId),
    getJurusanList(),
    getAngkatanList(),
  ]);

  if (!student) {
    notFound();
  }

  return (
    <StudentForm 
      mode="update" 
      student={student}
      jurusanList={jurusanResult.data}
      angkatanList={angkatanResult.data}
    />
  );
}
