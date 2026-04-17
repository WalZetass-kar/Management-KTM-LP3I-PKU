import { VerificationWorkspace } from "@/features/verification/components/verification-workspace";
import { getMahasiswaList } from "@/lib/mahasiswa";

export default async function VerificationPage() {
  const { data, error } = await getMahasiswaList();

  return <VerificationWorkspace students={data} errorMessage={error} />;
}
