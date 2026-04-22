import { MahasiswaAngkatanForm } from "@/features/mahasiswa-angkatan/components/mahasiswa-angkatan-form";
import { getJurusan } from "@/actions/jurusan";

export default async function TambahMahasiswaAngkatanPage() {
  const jurusanResult = await getJurusan();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tambah Mahasiswa Angkatan</h1>
        <p className="text-muted-foreground">
          Lengkapi data mahasiswa baru dengan informasi angkatan yang sesuai.
        </p>
      </div>
      
      <MahasiswaAngkatanForm 
        jurusan={jurusanResult.data || []}
        errorMessage={jurusanResult.error}
      />
    </div>
  );
}