-- Create storage bucket for student photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'student-photos',
  'student-photos',
  true,
  2097152, -- 2MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for student-photos bucket
CREATE POLICY "Allow authenticated users to upload student photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'student-photos' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Allow public read access to student photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'student-photos');

CREATE POLICY "Allow authenticated users to update student photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'student-photos' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Allow authenticated users to delete student photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'student-photos' AND
    auth.role() = 'authenticated'
  );