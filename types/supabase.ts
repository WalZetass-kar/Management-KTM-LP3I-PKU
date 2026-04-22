export interface Database {
  public: {
    Tables: {
      angkatan: {
        Row: {
          id: number;
          tahun: string;
          nama_angkatan: string;
          status: "Aktif" | "Tidak Aktif";
          keterangan: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: never;
          tahun: string;
          nama_angkatan: string;
          status?: "Aktif" | "Tidak Aktif";
          keterangan?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          tahun?: string;
          nama_angkatan?: string;
          status?: "Aktif" | "Tidak Aktif";
          keterangan?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      jurusan: {
        Row: {
          id: number;
          nama_jurusan: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: never;
          nama_jurusan: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          nama_jurusan?: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      mahasiswa: {
        Row: {
          id: number;
          nama: string;
          nim: string;
          jurusan: string | null;
          jurusan_id: number | null;
          angkatan: string | null;
          angkatan_id: number | null;
          alamat: string;
          no_hp: string;
          foto_url: string | null;
          status: "Aktif" | "Menunggu" | "Tidak Aktif" | "Lulus" | "Cuti";
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: never;
          nama: string;
          nim: string;
          jurusan?: string | null;
          jurusan_id?: number | null;
          angkatan?: string | null;
          angkatan_id?: number | null;
          alamat: string;
          no_hp: string;
          foto_url?: string | null;
          status?: "Aktif" | "Menunggu" | "Tidak Aktif" | "Lulus" | "Cuti";
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          nama?: string;
          nim?: string;
          jurusan?: string | null;
          jurusan_id?: number | null;
          angkatan?: string | null;
          angkatan_id?: number | null;
          alamat?: string;
          no_hp?: string;
          foto_url?: string | null;
          status?: "Aktif" | "Menunggu" | "Tidak Aktif" | "Lulus" | "Cuti";
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "mahasiswa_jurusan_id_fkey";
            columns: ["jurusan_id"];
            referencedRelation: "jurusan";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "mahasiswa_angkatan_id_fkey";
            columns: ["angkatan_id"];
            referencedRelation: "angkatan";
            referencedColumns: ["id"];
          }
        ];
      };
      mahasiswa_angkatan: {
        Row: {
          id: number;
          full_name: string;
          nim: string;
          angkatan: string;
          study_program: string;
          status: "Aktif" | "Menunggu" | "Tidak Aktif" | "Lulus" | "Cuti";
          photo_url: string | null;
          address: string;
          phone_number: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: never;
          full_name: string;
          nim: string;
          angkatan: string;
          study_program: string;
          status?: "Aktif" | "Menunggu" | "Tidak Aktif" | "Lulus" | "Cuti";
          photo_url?: string | null;
          address: string;
          phone_number: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          full_name?: string;
          nim?: string;
          angkatan?: string;
          study_program?: string;
          status?: "Aktif" | "Menunggu" | "Tidak Aktif" | "Lulus" | "Cuti";
          photo_url?: string | null;
          address?: string;
          phone_number?: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      student_accounts: {
        Row: {
          created_at: string | null;
          id: string;
          mahasiswa_id: string;
          must_change_password: boolean;
          nim: string;
          password_hash: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          mahasiswa_id: string;
          must_change_password?: boolean;
          nim: string;
          password_hash: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          mahasiswa_id?: string;
          must_change_password?: boolean;
          nim?: string;
          password_hash?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          id: string;
          username: string;
          role: "admin" | "super_admin";
          created_at: string;
          photo_url: string | null;
        };
        Insert: {
          id: string;
          username: string;
          role?: "admin" | "super_admin";
          created_at?: string;
          photo_url?: string | null;
        };
        Update: {
          username?: string;
          role?: "admin" | "super_admin";
          created_at?: string;
          photo_url?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
