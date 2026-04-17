import { redirect } from "next/navigation";

interface EditStudentAliasPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditStudentAliasPage({ params }: EditStudentAliasPageProps) {
  const { id } = await params;

  redirect(`/mahasiswa/${id}/edit`);
}
