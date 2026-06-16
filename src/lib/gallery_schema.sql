-- UPGRADE SCHEMA FOR GALLERY TABLE
-- Execute this script in your Supabase SQL Editor.

-- 1. Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  src TEXT NOT NULL,
  aspect TEXT DEFAULT 'aspect-[4/3]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Disable Row-Level Security (RLS) so anyone using the public anon client can insert/delete gallery items
ALTER TABLE gallery DISABLE ROW LEVEL SECURITY;

-- 2. Seed default gallery images
INSERT INTO gallery (src, aspect)
VALUES 
  ('images/DSC_5976.JPG', 'aspect-[4/3]'),
  ('images/DSC_6002.JPG', 'aspect-[3/4]'),
  ('images/DSC_6005.JPG', 'aspect-square'),
  ('images/DSC_6015.JPG', 'aspect-[3/4]'),
  ('images/DSC_6154.JPG', 'aspect-[4/3]'),
  ('images/DSC_6211.JPG', 'aspect-square'),
  ('images/DSC_6225.JPG', 'aspect-[4/3]'),
  ('images/DSC_6228.JPG', 'aspect-[3/4]'),
  ('images/DSC_6292.JPG', 'aspect-[4/3]'),
  ('images/DSC_6353.JPG', 'aspect-square'),
  ('images/DSC_6360.JPG', 'aspect-[3/4]'),
  ('images/DSC_6368.JPG', 'aspect-[4/3]'),
  ('images/DSC_6371.JPG', 'aspect-square'),
  ('images/DSC_6380.JPG', 'aspect-[3/4]'),
  ('images/DSC_6387.JPG', 'aspect-[4/3]'),
  ('images/DSC_6395.JPG', 'aspect-[3/4]'),
  ('images/IMG_20230611_002038.jpg', 'aspect-square')
ON CONFLICT DO NOTHING;

-- Force reload the schema cache so PostgREST picks up the new table immediately
NOTIFY pgrst, 'reload schema';
