export type StudentStatus = "Aktif" | "Menunggu" | "Tidak Aktif" | "Lulus" | "Cuti";

export interface StudentRecord {
  id: number;
  fullName: string;
  nim: string;
  studyProgram: string;
  status: StudentStatus;
  photoUrl: string | null;
  address: string;
  phoneNumber: string;
  angkatan?: string;
  createdAt: string;
  // Alumni fields
  tahunLulus?: string | null;
  pekerjaanSaatIni?: string | null;
  perusahaanSaatIni?: string | null;
  lokasiSaatIni?: string | null;
}

export interface VerificationRecord extends StudentRecord {
  validUntil: string;
  issuedDate: string;
}

export interface StudentFormValues {
  fullName: string;
  nim: string;
  studyProgram: string;
  address: string;
  phoneNumber: string;
  status: StudentStatus;
  angkatan: string;
  // Alumni fields (optional)
  tahunLulus?: string;
  pekerjaanSaatIni?: string;
  perusahaanSaatIni?: string;
  lokasiSaatIni?: string;
}
