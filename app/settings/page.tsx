import { SettingsPanel } from "@/features/settings/components/settings-panel";
import { getDashboardStats } from "@/lib/dashboard";
import { getMahasiswaList } from "@/lib/mahasiswa";
import { getJurusanList } from "@/lib/jurusan";
import { getAngkatanList } from "@/lib/angkatan";

export default async function SettingsPage() {
  const [statsResult, mahasiswaResult, jurusanResult, angkatanResult] = await Promise.all([
    getDashboardStats(),
    getMahasiswaList(),
    getJurusanList(),
    getAngkatanList(),
  ]);

  return (
    <SettingsPanel
      stats={statsResult.data}
      totalMahasiswa={mahasiswaResult.data.length}
      totalJurusan={jurusanResult.data.length}
      totalAngkatan={angkatanResult.data.length}
    />
  );
}
