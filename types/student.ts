export type StudentStatus = "Aktif" | "Menunggu";

export interface StudentRecord {
  id: number;
  fullName: string;
  nim: string;
  studyProgram: string;
  status: StudentStatus;
  photoUrl: string | null;
  address: string;
  phoneNumber: string;
  createdAt: string;
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
}
