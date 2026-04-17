import { KtmGenerator } from "@/features/ktm/components/ktm-generator";
import { getMahasiswaList } from "@/lib/mahasiswa";

export default async function GenerateKtmPage() {
  const { data, error } = await getMahasiswaList();

  return <KtmGenerator students={data} errorMessage={error} />;
}
