-- Create angkatan table for managing graduation years
CREATE TABLE IF NOT EXISTS angkatan (
  id SERIAL PRIMARY KEY,
  tahun VARCHAR(4) UNIQUE NOT NULL,
  nama_angkatan VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Tidak Aktif')),
  keterangan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_angkatan_tahun ON angkatan(tahun);
CREATE INDEX IF NOT EXISTS idx_angkatan_status ON angkatan(status);

-- Add RLS (Row Level Security) policies
ALTER TABLE angkatan ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can read angkatan" ON angkatan
  FOR SELECT TO authenticated
  USING ((SELECT public.is_admin_user()));

CREATE POLICY "Admins can insert angkatan" ON angkatan
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT public.is_admin_user()));

CREATE POLICY "Admins can update angkatan" ON angkatan
  FOR UPDATE TO authenticated
  USING ((SELECT public.is_admin_user()))
  WITH CHECK ((SELECT public.is_admin_user()));

CREATE POLICY "Admins can delete angkatan" ON angkatan
  FOR DELETE TO authenticated
  USING ((SELECT public.is_admin_user()));

-- Insert sample data for testing
INSERT INTO angkatan (tahun, nama_angkatan, status, keterangan) VALUES
('2023', 'Angkatan 2023', 'Aktif', 'Angkatan tahun 2023'),
('2024', 'Angkatan 2024', 'Aktif', 'Angkatan tahun 2024'),
('2025', 'Angkatan 2025', 'Aktif', 'Angkatan tahun 2025'),
('2026', 'Angkatan 2026', 'Aktif', 'Angkatan tahun 2026'),
('2027', 'Angkatan 2027', 'Aktif', 'Angkatan tahun 2027')
ON CONFLICT (tahun) DO NOTHING;