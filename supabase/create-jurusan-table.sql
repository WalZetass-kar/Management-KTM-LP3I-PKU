-- Create jurusan table if not exists
CREATE TABLE IF NOT EXISTS jurusan (
  id SERIAL PRIMARY KEY,
  nama_jurusan VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_jurusan_nama ON jurusan(nama_jurusan);

-- Add RLS (Row Level Security) policies
ALTER TABLE jurusan ENABLE ROW LEVEL SECURITY;

-- Create policies using is_admin_user() function
CREATE POLICY "Admins can read jurusan" ON jurusan
  FOR SELECT TO authenticated
  USING ((SELECT public.is_admin_user()));

CREATE POLICY "Admins can insert jurusan" ON jurusan
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT public.is_admin_user()));

CREATE POLICY "Admins can update jurusan" ON jurusan
  FOR UPDATE TO authenticated
  USING ((SELECT public.is_admin_user()))
  WITH CHECK ((SELECT public.is_admin_user()));

CREATE POLICY "Admins can delete jurusan" ON jurusan
  FOR DELETE TO authenticated
  USING ((SELECT public.is_admin_user()));

-- Insert sample data for testing (optional)
INSERT INTO jurusan (nama_jurusan) VALUES
('Teknik Informatika'),
('Sistem Informasi'),
('Teknik Komputer'),
('Manajemen Informatika'),
('Rekayasa Perangkat Lunak'),
('Keamanan Siber'),
('Data Science'),
('Multimedia dan Jaringan')
ON CONFLICT (nama_jurusan) DO NOTHING;