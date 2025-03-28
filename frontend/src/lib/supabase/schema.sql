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