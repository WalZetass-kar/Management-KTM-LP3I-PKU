-- Add angkatan column to mahasiswa table
ALTER TABLE mahasiswa 
ADD COLUMN IF NOT EXISTS angkatan VARCHAR(4);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_mahasiswa_angkatan ON mahasiswa(angkatan);

-- Update existing records with default angkatan based on created_at year
UPDATE mahasiswa 
SET angkatan = EXTRACT(YEAR FROM created_at)::VARCHAR
WHERE angkatan IS NULL;

-- Set default value for new records
ALTER TABLE mahasiswa 
ALTER COLUMN angkatan SET DEFAULT '2025';