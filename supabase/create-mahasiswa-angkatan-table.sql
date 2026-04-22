-- Create mahasiswa_angkatan table
CREATE TABLE IF NOT EXISTS mahasiswa_angkatan (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  nim VARCHAR(50) UNIQUE NOT NULL,
  angkatan VARCHAR(4) NOT NULL,
  study_program VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Menunggu',
  photo_url TEXT,
  address TEXT NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_mahasiswa_angkatan_angkatan ON mahasiswa_angkatan(angkatan);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_angkatan_status ON mahasiswa_angkatan(status);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_angkatan_study_program ON mahasiswa_angkatan(study_program);

-- Add RLS (Row Level Security) policies if needed
ALTER TABLE mahasiswa_angkatan ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all records
CREATE POLICY "Allow authenticated users to read mahasiswa_angkatan" ON mahasiswa_angkatan
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to insert records
CREATE POLICY "Allow authenticated users to insert mahasiswa_angkatan" ON mahasiswa_angkatan
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update records
CREATE POLICY "Allow authenticated users to update mahasiswa_angkatan" ON mahasiswa_angkatan
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete records
CREATE POLICY "Allow authenticated users to delete mahasiswa_angkatan" ON mahasiswa_angkatan
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample data for testing (optional)
INSERT INTO mahasiswa_angkatan (full_name, nim, angkatan, study_program, status, address, phone_number) VALUES
('Ahmad Rizki Pratama', '2025001001', '2025', 'Teknik Informatika', 'Aktif', 'Jl. Sudirman No. 123, Pekanbaru', '081234567890'),
('Siti Nurhaliza', '2025001002', '2025', 'Sistem Informasi', 'Aktif', 'Jl. Ahmad Yani No. 456, Pekanbaru', '081234567891'),
('Budi Santoso', '2026001001', '2026', 'Teknik Komputer', 'Menunggu', 'Jl. Diponegoro No. 789, Pekanbaru', '081234567892'),
('Dewi Sartika', '2026001002', '2026', 'Manajemen Informatika', 'Aktif', 'Jl. Gajah Mada No. 321, Pekanbaru', '081234567893'),
('Eko Prasetyo', '2027001001', '2027', 'Teknik Informatika', 'Menunggu', 'Jl. Kartini No. 654, Pekanbaru', '081234567894')
ON CONFLICT (nim) DO NOTHING;