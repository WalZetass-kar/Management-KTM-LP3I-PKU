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

-- Create policy to allow authenticated users to read all records
CREATE POLICY "Allow authenticated users to read jurusan" ON jurusan
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to insert records
CREATE POLICY "Allow authenticated users to insert jurusan" ON jurusan
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update records
CREATE POLICY "Allow authenticated users to update jurusan" ON jurusan
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete records
CREATE POLICY "Allow authenticated users to delete jurusan" ON jurusan
  FOR DELETE USING (auth.role() = 'authenticated');

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