import { LandingPageComponent } from "@/components/landing-page";

async function getHackathons() {
  try {
    console.log('Fetching hackathons...');
    const res = await fetch('http://localhost:1337/api/hackathons?populate=*', { 
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
    <LandingPageComponent initialHackathons={hackathons} />
  );
}