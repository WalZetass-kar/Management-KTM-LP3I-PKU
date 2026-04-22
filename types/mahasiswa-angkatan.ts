import type { StudentStatus } from "./student";

export interface MahasiswaAngkatanRecord {
  id: number;
  fullName: string;
  nim: string;
  angkatan: string;
  studyProgram: string;
  status: StudentStatus;
  photoUrl: string | null;
  address: string;
  phoneNumber: string;
  createdAt: string;
}

export interface MahasiswaAngkatanFormValues {
  fullName: string;
  nim: string;
  angkatan: string;
  studyProgram: string;
  address: string;
  phoneNumber: string;
  status: StudentStatus;
  photoUrl?: string | null;
}