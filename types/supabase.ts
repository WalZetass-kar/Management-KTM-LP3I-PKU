export interface Database {
  public: {
    Tables: {
      mahasiswa: {
        Row: {
          id: number;
          nama: string;
          nim: string;
          jurusan: string;
          alamat: string;
          no_hp: string;
          foto_url: string | null;
          status: "Aktif" | "Menunggu";
          created_at: string;
        };
        Insert: {
          id?: never;
          nama: string;
          nim: string;
          jurusan: string;
          alamat: string;
          no_hp: string;
          foto_url?: string | null;
          status?: "Aktif" | "Menunggu";
          created_at?: string;
        };
        Update: {
          nama?: string;
          nim?: string;
          jurusan?: string;
          alamat?: string;
          no_hp?: string;
          foto_url?: string | null;
          status?: "Aktif" | "Menunggu";
          created_at?: string;
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
        };
        Insert: {
          id: string;
          username: string;
          role?: "admin" | "super_admin";
          created_at?: string;
        };
        Update: {
          username?: string;
          role?: "admin" | "super_admin";
          created_at?: string;
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
