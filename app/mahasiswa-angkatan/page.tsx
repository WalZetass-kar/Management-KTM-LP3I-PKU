import { AngkatanTable } from "@/features/mahasiswa-angkatan/components/angkatan-table";
import { getAngkatanList } from "@/lib/angkatan";

export default async function MahasiswaAngkatanPage() {
  const { data: angkatanList, error } = await getAngkatanList();

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Tahun Angkatan</h1>
          <p className="mt-2 text-sm text-gray-600">
            Kelola tahun angkatan yang tersedia dalam sistem
          </p>
        </div>
        
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Tahun Angkatan</h1>
        <p className="mt-2 text-sm text-gray-600">
          Kelola tahun angkatan yang tersedia dalam sistem. Tahun angkatan yang ditambahkan di sini akan muncul sebagai pilihan saat menambah mahasiswa.
        </p>
      </div>

      <AngkatanTable angkatanList={angkatanList} />
    </div>
  );
}