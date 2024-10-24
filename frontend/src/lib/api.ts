import { Hackathon } from '@/types/hackathon'

export async function getHackathonBySlug(slug: string): Promise<Hackathon | null> {
  try {
    const res = await fetch(`http://localhost:1337/api/hackathons?filters[slug][$eq]=${slug}&populate=*`, {
      cache: 'no-store'
    })

    if (!res.ok) {
      throw new Error('Failed to fetch hackathon')
    }

    const data = await res.json()
    return data.data[0] as Hackathon || null
  } catch (error) {
    console.error('Error fetching hackathon:', error)
    return null
  }
}