-- Add "Lulus" status to mahasiswa table for alumni support
-- This allows the system to distinguish between active students and alumni

-- Drop existing constraint
ALTER TABLE public.mahasiswa 
DROP CONSTRAINT IF EXISTS mahasiswa_status_check;

-- Add new constraint with "Lulus" status included
ALTER TABLE public.mahasiswa 
ADD CONSTRAINT mahasiswa_status_check 
CHECK (status IN ('Aktif', 'Menunggu', 'Lulus'));

-- Optional: Update some existing students to alumni status for testing
-- Uncomment the line below if you want to mark some students as alumni
-- UPDATE public.mahasiswa SET status = 'Lulus' WHERE nim IN ('202001001', '202001002');
