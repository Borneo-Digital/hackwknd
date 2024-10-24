import { HackathonPage } from '@/components/hackathon-page'
import { getHackathonBySlug } from '@/lib/api'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const hackathon = await getHackathonBySlug(slug)

  console.log('Hackathon data:', hackathon);    
  
  if (!hackathon) {
    notFound()
  }

  return <HackathonPage hackathon={hackathon} />
}