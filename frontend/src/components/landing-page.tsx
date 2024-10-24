'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin } from "lucide-react"

interface Hackathon {
  id: string;
  Title: string;
  Theme: string;
  Date: string;
  Location: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface LandingPageComponentProps {
  hackathons: Hackathon[];
}

function formatDate(dateString: string): string {
  try {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return the original string if formatting fails
  }
}

export function LandingPageComponent({ hackathons }: LandingPageComponentProps) {
  console.log('Hackathons received in LandingPageComponent:', hackathons);
  const [typedText, setTypedText] = useState('')
  const fullText = 'Welcome to HackWeekend'

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


  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-teal-500">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-black">HackWknd</div>
          <nav>
            <ul className="flex space-x-4">
              {['About', 'Events', 'Register'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-black hover:text-teal-500 transition-colors relative group"
                  >
                    {item}
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="py-20 text-center">
          <h1 className="text-5xl font-bold mb-4 min-h-[60px]">{typedText}</h1>
          <p className="text-xl mb-8">72 hours of innovation, collaboration, and problem-solving</p>
          <Button className="bg-teal-500 hover:bg-teal-600 text-white transition-transform hover:scale-105 duration-300">
            Learn More
          </Button>
        </section>

        <section id="events" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Upcoming Hackathons</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {hackathons && hackathons.length > 0 ? (
              hackathons.map((hackathon, index) => {
                console.log('Rendering hackathon:', hackathon);
                return (
                  <HackathonCard
                    key={hackathon.id || index}
                    title={hackathon.Title}
                    theme={hackathon.Theme}
                    date={hackathon.Date}
                    location={hackathon.Location}
                    delay={index * 300}
                  />
                );
              })
            ) : (
              <p className="col-span-2 text-center text-xl">No hackathons available at the moment.</p>
            )}
          </div>
        </div>
      </section>

        <section id="register" className="py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Hack?</h2>
          <p className="text-xl mb-8">Join us for an unforgettable weekend of innovation and creativity!</p>
          <Button className="bg-teal-500 hover:bg-teal-600 text-white text-lg px-8 py-4 animate-pulse hover:animate-none transition-all duration-300 hover:scale-105">
            Register Now
          </Button>
        </section>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} HackWeekend. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function HackathonCard({ title, theme, date, location, delay }: {
  title: string;
  theme: string;
  date: string;
  location: string;
  delay: number;
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const formattedDate = formatDate(date);

  return (
    <Card className={`bg-white border border-teal-500 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-black">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-4">{theme}</p>
        <div className="flex items-center mb-2">
          <Calendar className="w-5 h-5 mr-2 text-teal-500" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center mb-2">
          <MapPin className="w-5 h-5 mr-2 text-teal-500" />
          <span>{location}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-2 text-teal-500" />
          <span>72 hours</span>
        </div>
      </CardContent>
    </Card>
  )
}