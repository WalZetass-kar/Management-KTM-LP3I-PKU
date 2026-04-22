import { StudentForm } from "@/features/students/components/student-form";
import { getJurusanList } from "@/lib/jurusan";
import { getAngkatanList } from "@/lib/angkatan";

export default async function AddStudentPage() {
  const [jurusanResult, angkatanResult] = await Promise.all([
    getJurusanList(),
    getAngkatanList(),
  ]);

  return (
    <StudentForm 
      mode="create" 
      jurusanList={jurusanResult.data}
      angkatanList={angkatanResult.data}
    />
  );
}
