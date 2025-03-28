import LandingPageComponent from "@/components/landing-page";
import { getHackathons } from '@/lib/supabase/api';

export default async function Home() {
  const hackathons = await getHackathons();
  
  return (
    <>
      <LandingPageComponent initialHackathons={hackathons} />
      <div className="fixed bottom-6 right-6 z-50">
        <a href="/aws-innovation-challenge" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded-full shadow-lg transition-all hover:shadow-xl">
          <span className="font-medium">AWS Innovation Challenge</span>
          <span className="text-sm bg-white text-blue-600 rounded-full px-2 py-1">New!</span>
        </a>
      </div>
    </>
  );
}