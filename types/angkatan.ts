export interface Angkatan {
  id: number;
  tahun: string;
  nama_angkatan: string;
  status: 'Aktif' | 'Tidak Aktif';
  keterangan?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface CreateAngkatanData {
  tahun: string;
  nama_angkatan: string;
  status: 'Aktif' | 'Tidak Aktif';
  keterangan?: string;
}

export interface UpdateAngkatanData extends CreateAngkatanData {
  id: number;
}