import  LandingPageComponent  from "@/components/landing-page";

async function getHackathons() {
  try {
    console.log('Fetching hackathons...');
    // Use the internal API route instead of calling Strapi directly
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.NEXT_PUBLIC_HOST || 'localhost:3000';
    
    // Use the absolute URL in server components
    const url = `${protocol}://${host}/api/hackathons?populate=*`;
    console.log('Fetching from URL:', url);
    
    const res = await fetch(url, { 
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status}`);
      return [];
    }
    
    const data = await res.json();
    console.log('Hackathons data received:', data);
    return data.data;
  } catch (error) {
    console.error('Failed to fetch hackathons:', error);
    return [];
  }
}

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