-- Create hackathons table
CREATE TABLE hackathons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  theme TEXT,
  date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  description JSONB,
  schedule JSONB,
  prizes JSONB,
  faq JSONB,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  partnership_logos JSONB, -- Array of partnership logo objects with id, url, and name
  poster_images JSONB, -- Array of poster images with id, url, caption, and order
  event_status TEXT,
  registration_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create registrations table
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hackathon_id UUID REFERENCES hackathons(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for hackathons
CREATE POLICY "Public hackathons are viewable by everyone"
  ON hackathons FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert hackathons"
  ON hackathons FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update hackathons"
  ON hackathons FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create policies for registrations
CREATE POLICY "Authenticated users can view registrations"
  ON registrations FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can create registrations"
  ON registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update registrations"
  ON registrations FOR UPDATE
  USING (auth.role() = 'authenticated');

-- IMPORTANT: ALTER TABLE statements to add required columns
-- Execute these in the Supabase SQL Editor to add the new columns:
/*
-- Add partnership_logos column to hackathons table if it doesn't exist
ALTER TABLE hackathons 
ADD COLUMN IF NOT EXISTS partnership_logos JSONB DEFAULT '[]'::jsonb;

-- Add poster_images column to hackathons table if it doesn't exist
ALTER TABLE hackathons 
ADD COLUMN IF NOT EXISTS poster_images JSONB DEFAULT '[]'::jsonb;
*/

-- Storage bucket for partnership logos
-- IMPORTANT: This section contains SQL that must be executed manually in the Supabase Dashboard SQL Editor.
-- These statements are NOT automatically applied when running migrations.

/*
-- Supabase Storage Configuration - Run in SQL Editor
-----------------------------------------------------------------------------
-- 1. Create the partnership-logo bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('partnership-logo', 'partnership-logo', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow anyone to view files in the partnership-logo bucket
CREATE POLICY "Public can view partnership logos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'partnership-logo');

-- 3. Allow anyone to upload to the partnership-logo bucket
-- This is more permissive, but simplifies things for development
CREATE POLICY "Public can upload partnership logos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'partnership-logo');

-- 4. Allow anyone to update files in the partnership-logo bucket they uploaded
CREATE POLICY "Public can update own partnership logos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'partnership-logo');

-- 5. Allow anyone to delete files in the partnership-logo bucket they uploaded
CREATE POLICY "Public can delete own partnership logos" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'partnership-logo');
*/

-- If you need more security, use the authenticated policies instead:
/*
-- Stricter policies that require authentication
CREATE POLICY "Authenticated users can upload partnership logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'partnership-logo' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update partnership logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'partnership-logo' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete partnership logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'partnership-logo' AND auth.role() = 'authenticated');
*/