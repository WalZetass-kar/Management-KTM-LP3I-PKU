export interface JurusanRecord {
  id: number;
  namaJurusan: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface JurusanFormValues {
  namaJurusan: string;
}
