import { notFound } from "next/navigation";
import { StudentForm } from "@/features/students/components/student-form";
import { getMahasiswaById } from "@/lib/mahasiswa";

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

  const { data: student } = await getMahasiswaById(studentId);

  if (!student) {
    notFound();
  }

  return <StudentForm mode="update" student={student} />;
}
