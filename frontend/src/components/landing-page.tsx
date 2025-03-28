'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, Clock, MapPin, ArrowRight, Code, Users, Lightbulb, Terminal, Code2 } from "lucide-react"
import Link from 'next/link'
import { Hackathon } from '@/types/hackathon'
import { MenuBar } from './MenuBar'
import { Footer } from './Footer'

interface LandingPageComponentProps {
  initialHackathons: Hackathon[];
}

const codeSnippets = [
  {
    language: 'python',
    code: 'def hack_wknd():\n    ideas = generate_ideas()\n    solution = build_prototype(ideas)\n    return innovate(solution)'
  },
  {
    language: 'javascript',
    code: 'async function createInnovation() {\n  const team = await formTeam();\n  const solution = team.brainstorm();\n  return solution.deploy();'
  },
  {
    language: 'rust',
    code: 'fn build_future() -> Innovation {\n    let ideas = generate_ideas();\n    ideas.transform()\n        .innovate()\n}'
  }
]

const formatDate = (dateString: string): string => {
  try {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

const seededRandom = (seed: number) => {
  let state = seed;
  return function () {
    state = (state * 1664525 + 1013904223) % 2 ** 32;
    return state / 2 ** 32;
  }
}

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="bg-slate-900 rounded-lg shadow-xl border border-gray-800 transform hover:scale-105 transition-all duration-300">
    <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <div className="flex-1 text-center">
        {icon}
      </div>
    </div>
    <div className="p-6 font-mono">
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">
        <span className="text-hack-secondary">{'>'}</span> {description}
      </p>
    </div>
  </div>
);

const HackathonCard: React.FC<{ hackathon: Hackathon, delay: number }> = ({ hackathon, delay }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (!hackathon || !hackathon.attributes) return null;

  const { Title, Theme, Date, Location, EventStatus } = hackathon.attributes;
  const formattedDate = formatDate(Date);

  return (
    <Card className={`bg-slate-900/80 backdrop-blur-sm border-gray-800 transform transition-all duration-500 
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <CardContent className="p-6 font-mono space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-white hover:text-hack-primary transition-colors">
              <Link href={`/hackathon/${hackathon.attributes.slug}`}>
                {Title}
              </Link>
            </h3>
          </div>
          {EventStatus && (
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(EventStatus)}`}>
              {EventStatus}
            </span>
          )}
        </div>
        <div className="text-gray-400">
          <span className="text-hack-secondary">theme</span> {Theme}
        </div>
        <div className="space-y-2 text-gray-400">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-hack-primary" />
            <span className="text-hack-secondary mr-2">date:</span>
            <span className="font-normal">{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-hack-primary" />
            <span className="text-hack-secondary mr-2">location:</span>
            <span className="font-normal">{Location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-hack-primary" />
            <span className="text-hack-secondary mr-2">duration:</span>
            <span className="font-normal">45 hours</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'upcoming':
      return 'bg-blue-500/20 border border-blue-500/50 text-blue-400';
    case 'ongoing':
      return 'bg-green-500/20 border border-green-500/50 text-green-400';
    case 'completed':
      return 'bg-gray-500/20 border border-gray-500/50 text-gray-400';
    default:
      return 'bg-gray-500/20 border border-gray-500/50 text-gray-400';
  }
}

const LandingPage: React.FC<LandingPageComponentProps> = ({ initialHackathons }) => {
  const [hackathons, setHackathons] = useState<Hackathon[]>(initialHackathons);
  const [isLoading, setIsLoading] = useState(false);
  const [typedText, setTypedText] = useState('')
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0)
  const [codeText, setCodeText] = useState('')
  const fullText = 'Welcome to HackWknd'

  const floatingBlockPositions = useMemo(() => {
    const random = seededRandom(12345); // Use a fixed seed
    return Array.from({ length: 5 }, () => ({
      left: random() * 100,
      top: random() * 100,
    }));
  }, []);

  const hackathonsSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchHackathons = async () => {
      setIsLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
        const res = await fetch(`${apiUrl}/api/hackathons?populate=*`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setHackathons(data.data);
      } catch (error) {
        console.error('Failed to fetch hackathons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 100)

    return () => clearInterval(typingInterval)
  }, [])

  useEffect(() => {
    let i = 0
    const currentSnippet = codeSnippets[currentCodeIndex].code

    const codeInterval = setInterval(() => {
      if (i < currentSnippet.length) {
        setCodeText(currentSnippet.slice(0, i + 1))
        i++
      } else {
        clearInterval(codeInterval)
        setTimeout(() => {
          setCurrentCodeIndex((prev) => (prev + 1) % codeSnippets.length)
          setCodeText('')
        }, 2000)
      }
    }, 50)

    return () => clearInterval(codeInterval)
  }, [currentCodeIndex])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 bg-grid bg-center opacity-10" />
      <MenuBar logo="HackWknd" logoSrc="/icon-hackwknd.svg" />

      <main className="relative">
        <section className="min-h-screen relative overflow-hidden flex items-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-hack-primary/20 to-hack-secondary/20 blur-3xl" />
            {floatingBlockPositions.map((position, i) => (
              <div
                key={i}
                className="absolute bg-white/5 backdrop-blur-sm rounded-lg p-4 code-float"
                style={{
                  left: `${position.left}%`,
                  top: `${position.top}%`,
                  animation: `float ${10 + i * 2}s infinite`,
                  animationDelay: `${i * -2}s`,
                  transform: `translate(${position.left > 50 ? '-100%' : '0'}, ${position.top < 20 ? '100%' : '0'})`,
                  zIndex: 1,
                }}
              >
                <Code2 className="w-6 h-6 text-hack-primary/50" />
              </div>
            ))}
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 break-words">
                  <span className="hack-gradient-text">{typedText}</span>
                </h1>
                <p className="text-lg sm:text-xl mb-8 text-gray-300">
                HackWknd is a 48-hours hackathon challenge that brings together participants from diverse backgrounds to tackle real-world community challenges through collaborative problem-solving and rapid prototyping.
                </p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button 
                  className="hack-button group"
                  onClick={() => {
                    hackathonsSectionRef.current?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }}
                >
                  Register Now
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="bg-slate-900 rounded-lg shadow-xl border border-gray-800">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 text-center">
                      <Terminal className="w-4 h-4 text-gray-400 inline-block" />
                    </div>
                  </div>
                  <div className="p-4 font-mono text-sm">
                    <div className="text-gray-400">$ {codeSnippets[currentCodeIndex].language}</div>
                    <pre className="text-hack-primary mt-2">
                      <code>{codeText}</code>
                    </pre>
                    <div className="animate-pulse inline-block mt-1">_</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold hack-gradient-text mb-4">Why participate in Hackwknd?</h2>
              <p className="text-gray-400">Join a weekend that sparks innovation and builds connections.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Code className="w-6 h-6 text-hack-primary" />}
                title="Learn by Doing"
                description="Tackle real-world tech challenges to build hands-on skills that matter."
              />
              <FeatureCard
                icon={<Users className="w-6 h-6 text-hack-secondary" />}
                title="Expand Your Networ"
                description="Meet industry leaders, mentors, and like-minded innovators who can shape your journey."
              />
              <FeatureCard
                icon={<Lightbulb className="w-6 h-6 text-hack-accent" />}
                title="Skill Showcase"
                description="Demonstrate your creativity and problem-solving abilities."
              />
              <FeatureCard
                icon={<Lightbulb className="w-6 h-6 text-hack-accent" />}
                title="Exclusive Support"
                description="Receive mentorship and guidance from experienced professionals."
              />
              <FeatureCard
                icon={<Lightbulb className="w-6 h-6 text-hack-accent" />}
                title="Get Rewarded"
                description="Stand out with innovative ideas and take home exciting prizes."
              />
            </div>
          </div>
        </section>

        <section id="events" ref={hackathonsSectionRef} className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="text-4xl font-bold hack-gradient-text mb-4">Upcoming HackWknd</h2>
              <p className="text-gray-400">Join our next innovation challenge</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {isLoading ? (
                <div className="col-span-2 text-center">
                  <p>Loading HackWknd...</p>
                </div>
              ) : hackathons && hackathons.length > 0 ? (
                hackathons.map((hackathon, index) => (
                  <HackathonCard
                    key={hackathon.id || index}
                    hackathon={hackathon}
                    delay={index * 300}
                  />
                ))
              ) : (
                <div className="col-span-2">
                  <Card className="bg-slate-900/80 backdrop-blur-sm border-gray-800">
                    <CardHeader className="border-b border-gray-800">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 font-mono">
                      <div className="text-hack-primary mb-2">$ get HackWknd</div>
                      <p className="text-gray-400">No HackWknd available at the moment...</p>
                      <div className="animate-pulse inline-block mt-1">_</div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="register" className="py-20 text-center">
          <div className="container mx-auto px-4">
            <div className="hack-card p-12">
              <h2 className="text-4xl font-bold mb-4">Ready to Hack?</h2>
              <p className="text-xl mb-8 text-gray-300">
                Join us for an unforgettable weekend of innovation and creativity!
              </p>
                <Button 
                  className="hack-button group"
                  onClick={() => {
                    hackathonsSectionRef.current?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }}
                >
                  Register Now
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage;