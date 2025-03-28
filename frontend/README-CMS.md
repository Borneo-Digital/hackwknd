# Hackathon CMS

A simple, internal CMS built into the Next.js frontend for managing hackathons and registrations.

## Setup

1. Create a Supabase project at [https://supabase.com](https://supabase.com)

2. Set up the database tables:

```sql
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
```

3. Enable Row Level Security and set up policies:

```sql
-- Enable RLS
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
```

4. Set up authentication in Supabase:
   - Go to Authentication > Settings
   - Set "Site URL" to your frontend URL
   - Enable "Email provider"

5. Create an admin user:
   - Go to Authentication > Users
   - Click "Add user"
   - Enter email and password for admin access

6. Create a `.env.local` file in the frontend directory:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```

7. Install dependencies:
   ```
   npm install
   ```

8. Start the development server:
   ```
   npm run dev
   ```

## Features

- **Authentication**: Secure admin access with Supabase Auth
- **Hackathon Management**: Create, edit, and publish hackathons
- **Registration Tracking**: Monitor and manage participant registrations
- **Export**: Export registration data to CSV for offline analysis

## Admin Routes

- `/admin` - Main dashboard
- `/admin/hackathons` - List and manage hackathons
- `/admin/hackathons/new` - Create a new hackathon
- `/admin/hackathons/[id]` - Edit an existing hackathon
- `/admin/registrations` - View and manage registrations

## Frontend Routes

- `/` - Home page listing active hackathons
- `/hackathon/[slug]` - Public hackathon page with registration form