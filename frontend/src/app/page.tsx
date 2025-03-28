import LandingPageComponent from "@/components/landing-page";
import { getHackathons } from '@/lib/supabase/api';

export default async function Home() {
  const hackathons = await getHackathons();
  
  return (
    <LandingPageComponent initialHackathons={hackathons} />
  );
}