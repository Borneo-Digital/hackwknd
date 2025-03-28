# HackWknd Frontend with Supabase Integration

This project has been refactored to use Supabase for backend services instead of Strapi. The integration includes:

- Authentication for admin users
- Database for hackathons and registrations
- Storage for images

## Setup

1. **Set up environment variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key  
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   NEXT_PUBLIC_DEV_MODE=true  # For development only
   ```

2. **Create Supabase database tables**:
   Run the SQL from `src/lib/supabase/schema.sql` in your Supabase SQL Editor.

3. **Development**:
   ```bash
   npm run dev
   ```

## Project Structure

- `/src/lib/supabase/` - Supabase integration files
  - `client.ts` - Supabase client setup
  - `api.ts` - API functions for hackathons and registrations
  - `auth-context.tsx` - Authentication context provider
  - `schema.sql` - Database schema

- `/src/app/admin/` - Admin CMS for managing content
  - `/login` - Admin login page
  - `/hackathons` - Hackathon management
  - `/registrations` - Registration management

## Routes

- `/` - Home page listing hackathons
- `/hackathon/[slug]` - Public hackathon page
- `/admin/*` - Admin routes (protected)

## Features

- **Authentication** - Email/password login for admin users
- **Hackathon Management** - Create, update, and delete hackathons
- **Registration Management** - View and manage participant registrations
- **Image Storage** - Upload and manage images for hackathons

## Development Mode

In development, you can enable mock authentication by setting `NEXT_PUBLIC_DEV_MODE=true` in your `.env.local` file. This allows you to bypass authentication for easier development.