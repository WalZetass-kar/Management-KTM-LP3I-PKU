import { KtmGeneratorModern } from "@/features/ktm/components/ktm-generator-modern";
import { getMahasiswaList } from "@/lib/mahasiswa";

export default async function GenerateKtmV3Page() {
  const { data, error } = await getMahasiswaList();

  return <KtmGeneratorModern students={data} errorMessage={error} />;
}
