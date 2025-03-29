"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Hackathon, DescriptionBlock } from "@/types/hackathon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Trophy,
  Medal,
  Award,
  Brain,
  AccessibilityIcon,
} from "lucide-react";
import { MenuBar } from "./MenuBar";
import { Footer } from "./Footer";
import Image from "next/image";
import { RegistrationForm } from "./RegistrationForm";
import { Modal } from "@/components/ui/modal";
// import Link from "next/link";

interface HackathonPageProps {
  hackathon: Hackathon;
}

interface FormattedSection {
  title?: string;
  content: string[];
  type: "paragraph" | "bulletPoints";
  formatting?: {
    bold?: boolean;
    italic?: boolean;
  };
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

export function HackathonPage({ hackathon }: HackathonPageProps) {
  const {
    Title,
    Theme,
    Date: hackathonDate,
    Location,
    Description,
    Schedule,
    Prizes,
    FAQ,
    EventStatus,
    RegistrationEndDate,
    Image: hackathonImage,
    PartnershipLogos = [],
  } = hackathon.attributes || hackathon; // Handle both new and old data structure

  const formattedDate = useMemo(
    () => formatDate(hackathonDate),
    [hackathonDate]
  );
  const formattedRegistrationEndDate = useMemo(
    () => formatDate(RegistrationEndDate),
    [RegistrationEndDate]
  );
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  useEffect(() => {
    // Remove time-based registration closure
    setIsRegistrationClosed(false);
  }, []);

  return (
    <div className="relative">
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 bg-grid bg-center opacity-10" />
      <MenuBar logo="HackWknd" logoSrc="/icon-hackwknd.svg" />

      <header className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-hack-primary/20 to-hack-secondary/20 blur-3xl" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4 hack-gradient-text">
              {Title}
            </h1>
            <p className="text-xl text-gray-300 mb-6">{Theme}</p>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    EventStatus
                  )}`}
                >
                  {EventStatus}
                </span>
                <span className="text-gray-400">
                  Registration ends: {formattedRegistrationEndDate}
                </span>
              </div>
              
              {PartnershipLogos && Array.isArray(PartnershipLogos) && PartnershipLogos.length > 0 && (
                <div className="mt-6">
                  <p className="text-gray-400 text-sm mb-2">In partnership with:</p>
                  <div className="flex flex-wrap items-center justify-center gap-6 mt-2">
                    {PartnershipLogos.map((logo, index) => (
                      <div key={logo?.id || index} className="flex flex-col items-center">
                        {logo?.url && (
                          <div className="w-24 h-16 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-md p-2">
                            <img 
                              src={logo.url} 
                              alt={logo.name || `Partner ${index + 1}`}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        )}
                        {logo?.name && (
                          <span className="text-xs text-gray-400 mt-1">{logo.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {hackathonImage && (
              <Card className="bg-slate-900/80 backdrop-blur-sm border-gray-800 overflow-hidden">
                <CardContent className="p-0">
                  {/* Using Supabase image URL directly */}
                  <Image
                    src={hackathonImage || '/hackwknd-logo.png'}
                    alt={Title || 'Hackathon Image'}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </CardContent>
              </Card>
            )}

            <Card className="bg-slate-900/80 backdrop-blur-sm border-gray-800">
              <CardContent className="p-6 font-mono">
                <div className="text-hack-primary mb-4">$ cat about.md</div>
                <div className="space-y-8">
                  {formatHackathonDescription(Description).map(
                    (section, index) => (
                      <div key={index} className="space-y-2">
                        {section.title && (
                          <h3 className="text-hack-secondary font-bold text-lg">
                            {section.title}
                          </h3>
                        )}
                        {section.type === "paragraph" ? (
                          <div className="text-gray-300 leading-relaxed">
                            {section.content.map(
                              (paragraph: string, pIndex: number) => (
                                <p key={pIndex} className="mb-4 last:mb-0">
                                  {/* Handle markdown-like formatting */}
                                  {paragraph.split(/(\*\*.*?\*\*|\*.*?\*)/).map((part, partIdx) => {
                                    if (part.startsWith('**') && part.endsWith('**')) {
                                      return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
                                    } else if (part.startsWith('*') && part.endsWith('*')) {
                                      return <em key={partIdx}>{part.slice(1, -1)}</em>;
                                    } else {
                                      return part;
                                    }
                                  })}
                                </p>
                              )
                            )}
                          </div>
                        ) : (
                          <ul className="space-y-2 text-gray-300">
                            {section.content.map(
                              (bullet: string, bIndex: number) => (
                                <li key={bIndex} className="flex items-start">
                                  <span className="text-hack-primary mr-2">
                                    •
                                  </span>
                                  <span className="flex-1">
                                    {/* Handle markdown-like formatting */}
                                    {bullet.split(/(\*\*.*?\*\*|\*.*?\*)/).map((part, partIdx) => {
                                      if (part.startsWith('**') && part.endsWith('**')) {
                                        return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
                                      } else if (part.startsWith('*') && part.endsWith('*')) {
                                        return <em key={partIdx}>{part.slice(1, -1)}</em>;
                                      } else {
                                        return part;
                                      }
                                    })}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {Schedule && Schedule.schedule && (
              <Card className="bg-slate-900/80 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <CardTitle className="text-hack-primary">
                    Event Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 font-mono">
                  <div className="text-hack-primary mb-4">
                    $ cat schedule.json
                  </div>
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-4"
                  >
                    {Schedule.schedule.map((day, dayIndex) => (
                      <AccordionItem
                        key={dayIndex}
                        value={`day-${dayIndex}`}
                        className="border border-gray-800 rounded-lg overflow-hidden"
                      >
                        <AccordionTrigger className="hover:no-underline px-4 py-3 bg-slate-800/50">
                          <div className="flex items-center space-x-4 w-full">
                            <div className="flex-1 text-left">
                              <h3 className="text-hack-primary font-bold">
                                {day.day}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {day.date}
                              </p>
                            </div>
                            <div className="text-xs text-gray-500 bg-slate-900/50 px-2 py-1 rounded">
                              {day.events.length} events
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="bg-slate-900/50">
                          <div className="space-y-4 p-4">
                            {day.events.map((event, eventIndex) => (
                              <div
                                key={eventIndex}
                                className="flex items-start space-x-2"
                              >
                                <Clock className="w-4 h-4 text-hack-primary" />
                                <div>
                                  <p className="text-sm text-gray-300">
                                    {event.time}
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    {event.event}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}

            {Prizes && Prizes.prizes && (
              <Card className="bg-slate-900/80 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <CardTitle className="text-hack-primary">Prizes</CardTitle>
                </CardHeader>
                <CardContent className="p-6 font-mono">
                  <div className="text-hack-primary mb-4">
                    $ cat prizes.json
                  </div>
                  
                  {/* Main Prizes */}
                  {Array.isArray(Prizes.prizes.main) && Prizes.prizes.main.length > 0 && (
                    <div className="space-y-6 mb-8">
                      {Prizes.prizes.main.map((prize, index) => {
                        // Define color classes based on the prize index
                        let bgColorClass = "bg-yellow-500/10 text-yellow-500";
                        if (index === 1) bgColorClass = "bg-slate-300/10 text-slate-300";
                        if (index === 2) bgColorClass = "bg-amber-600/10 text-amber-600";
                        if (index > 2) bgColorClass = "bg-indigo-500/10 text-indigo-500";
                        
                        return (
                          <div
                            key={prize.id || index}
                            className="relative bg-slate-800/50 rounded-lg p-6 border border-gray-800/50 hover:border-hack-primary/50 transition-colors"
                          >
                            <div className="flex items-start gap-4">
                              <div className={`p-3 rounded-lg ${bgColorClass}`}>
                                {prize.icon && getPrizeIcon(prize.icon)}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-1">
                                  {prize.rank}
                                </h3>
                                <div className="text-2xl font-bold text-hack-primary">
                                  RM{prize.amount}
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 pl-14">
                              <div className="text-gray-400 mb-3">
                                {prize.description}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* Legacy format support for backward compatibility */}
                  {!Prizes.prizes.main && (["first", "second", "third"] as const).some(place => Prizes.prizes[place]) && (
                    <div className="space-y-6 mb-8">
                      {(["first", "second", "third"] as const).map((place) => {
                        const prize = Prizes.prizes[place];
                        if (!prize) return null;
                        return (
                          <div
                            key={place}
                            className="relative bg-slate-800/50 rounded-lg p-6 border border-gray-800/50 hover:border-hack-primary/50 transition-colors"
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={`
                                  p-3 rounded-lg 
                                  ${
                                    place === "first"
                                      ? "bg-yellow-500/10 text-yellow-500"
                                      : place === "second"
                                      ? "bg-slate-300/10 text-slate-300"
                                      : "bg-amber-600/10 text-amber-600"
                                  }
                                `}
                              >
                                {prize.icon && getPrizeIcon(prize.icon)}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-1">
                                  {prize.rank}
                                </h3>
                                <div className="text-2xl font-bold text-hack-primary">
                                  RM{prize.amount}
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 pl-14">
                              <div className="text-gray-400 mb-3">
                                {prize.description}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Special Categories - New Array Format */}
                  {Array.isArray(Prizes.prizes.special) && Prizes.prizes.special.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-hack-secondary text-lg font-bold mb-4">
                        Special Categories
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Prizes.prizes.special.map((prize, index) => (
                          <div
                            key={prize.id || index}
                            className="bg-slate-800/30 rounded-lg p-4 border border-gray-800/50 hover:border-hack-secondary/50 transition-colors"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 rounded-lg bg-hack-secondary/10 text-hack-secondary">
                                {prize.icon && getPrizeIcon(prize.icon)}
                              </div>
                              <div>
                                <h4 className="font-bold text-white">
                                  {prize.rank}
                                </h4>
                                <div className="text-hack-secondary font-bold">
                                  RM{prize.amount}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-400">
                              {prize.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Special Categories - Legacy Object Format */}
                  {!Array.isArray(Prizes.prizes.special) && Prizes.prizes.special && (
                    <div className="mt-8">
                      <h3 className="text-hack-secondary text-lg font-bold mb-4">
                        Special Categories
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(Prizes.prizes.special).map(
                          ([key, prize]) => (
                            <div
                              key={key}
                              className="bg-slate-800/30 rounded-lg p-4 border border-gray-800/50 hover:border-hack-secondary/50 transition-colors"
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-lg bg-hack-secondary/10 text-hack-secondary">
                                  {prize.icon && getPrizeIcon(prize.icon)}
                                </div>
                                <div>
                                  <h4 className="font-bold text-white">
                                    {prize.rank}
                                  </h4>
                                  <div className="text-hack-secondary font-bold">
                                    RM{prize.amount}
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-400">
                                {prize.description}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {FAQ && FAQ.length > 0 && (
              <Card className="bg-slate-900/80 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <CardTitle className="text-hack-primary">FAQ</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {FAQ.map((item, index) => (
                      <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="border-gray-800"
                      >
                        <AccordionTrigger className="text-white hover:text-hack-primary">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-400">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </div>
          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="bg-slate-900/80 backdrop-blur-sm border-gray-800 sticky top-24">
              <CardHeader>
                <CardTitle className="text-hack-primary">
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 font-mono">
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-5 h-5 mr-3 text-hack-primary" />
                  <div>
                    <span className="text-hack-secondary block text-sm">
                      date:
                    </span>
                    {formattedDate}
                  </div>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-5 h-5 mr-3 text-hack-primary" />
                  <div>
                    <span className="text-hack-secondary block text-sm">
                      location:
                    </span>
                    {Location}
                  </div>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="w-5 h-5 mr-3 text-hack-primary" />
                  <div>
                    <span className="text-hack-secondary block text-sm">
                      duration:
                    </span>
                    45 hours
                  </div>
                </div>
                <div className="flex items-center text-gray-300">
                  <Users className="w-5 h-5 mr-3 text-hack-primary" />
                  <div>
                    <span className="text-hack-secondary block text-sm">
                      team size:
                    </span>
                    3-5 members
                  </div>
                </div>

                <Button
        disabled={isRegistrationClosed}
        className={`bg-hack-primary text-white px-6 py-3 rounded-lg hover:bg-hack-primary/80 transition-all duration-300 ${
          isRegistrationClosed ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={openForm}
      >
        Register Now
        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
      {isRegistrationClosed && (
        <p className="text-gray-500 mt-2">Registrations are now closed.</p>
      )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
   <Modal isOpen={isFormOpen} onClose={closeForm}>
   <RegistrationForm onClose={closeForm} />
 </Modal>
</div>
  );
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "upcoming":
      return "bg-hack-secondary/20 border border-hack-secondary/50 text-hack-secondary";
    case "ongoing":
      return "bg-hack-primary/20 border border-hack-primary/50 text-hack-primary";
    case "completed":
      return "bg-gray-500/20 border border-gray-500/50 text-gray-400";
    default:
      return "bg-gray-500/20 border border-gray-500/50 text-gray-400";
  }
};

const formatHackathonDescription = (
  description: string | DescriptionBlock[]
): FormattedSection[] => {
  // First try to detect if this is a JSON string and parse it
  if (typeof description === 'string' && 
      (description.startsWith('[') || description.startsWith('{'))) {
    try {
      const parsedJson = JSON.parse(description);
      // If parsing succeeded, call this function again with the parsed JSON
      return formatHackathonDescription(parsedJson);
    } catch (error) {
      console.error("Error parsing JSON string:", error);
      // Continue with normal string processing if parsing fails
    }
  }

  // If description is a string (legacy format), process it as before
  if (typeof description === 'string') {
    const isHeading = (line: string) => line.endsWith(":");
    const isBulletPoint = (line: string) => line.trim().startsWith("-");
    const sections: FormattedSection[] = [];
    let currentSection: FormattedSection | null = null;
    const lines = description.split("\n").filter((line) => line.trim());
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (isHeading(trimmedLine)) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: trimmedLine.slice(0, -1),
          content: [],
          type: "paragraph",
        };
      } else if (isBulletPoint(trimmedLine)) {
        if (
          !currentSection ||
          (currentSection.content.length > 0 &&
            currentSection.type !== "bulletPoints")
        ) {
          if (currentSection) sections.push(currentSection);
          currentSection = {
            content: [],
            type: "bulletPoints",
          };
        }
        currentSection.type = "bulletPoints";
        currentSection.content.push(trimmedLine.slice(1).trim());
      } else if (trimmedLine) {
        if (!currentSection) {
          currentSection = {
            content: [],
            type: "paragraph",
          };
        }
        if (currentSection.type === "paragraph") {
          currentSection.content.push(trimmedLine);
        } else {
          sections.push(currentSection);
          currentSection = {
            content: [trimmedLine],
            type: "paragraph",
          };
        }
      }
    });
    if (currentSection) {
      sections.push(currentSection);
    }
    return sections;
  }
  
  // If description is an array of blocks, process the structured JSON content
  if (Array.isArray(description)) {
    const sections: FormattedSection[] = [];
    let currentTitle = "";
    
    // Helper to extract formatted text from TextNode array
    const extractText = (children: any[]): string => {
      if (!children || !Array.isArray(children)) return "";
      
      return children.map(child => {
        if (!child) return "";
        let text = child.text || "";
        if (child.bold) text = `**${text}**`;
        if (child.italic) text = `*${text}*`;
        return text;
      }).join('');
    };
    
    description.forEach((block) => {
      if (!block) return;
      
      // Process headings (they become section titles)
      if (block.type === 'heading') {
        currentTitle = extractText(block.children);
      } 
      // Process bullet lists (they become bullet point sections)
      else if (block.type === 'bullet-list' && block.children?.length > 0) {
        const bullets = block.children.map(item => {
          if (item.children) {
            return extractText(item.children);
          }
          return '';
        }).filter(text => text.trim());
        
        if (bullets.length > 0) {
          sections.push({
            title: currentTitle,
            content: bullets,
            type: "bulletPoints"
          });
          currentTitle = ""; // Reset title after use
        }
      }
      // Process paragraphs (regular text content)
      else if (block.type === 'paragraph') {
        const rawText = extractText(block.children);
        if (!rawText.trim()) return; // Skip empty paragraphs
        
        // Extract sections by parsing text content
        const parseTextContent = (text: string): FormattedSection[] => {
          const result: FormattedSection[] = [];
          
          // Split text by double newlines to separate major sections
          const blocks = text.split(/\n\s*\n+/).filter(b => b.trim());
          
          blocks.forEach(block => {
            const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
            
            // Find section headings (lines ending with colon)
            const headingIndices: number[] = [];
            lines.forEach((line, idx) => {
              if (line.endsWith(':') && line.length < 60) {
                headingIndices.push(idx);
              }
            });
            
            // Process each section
            if (headingIndices.length > 0) {
              // Add ranges for each heading section
              for (let i = 0; i < headingIndices.length; i++) {
                const start = headingIndices[i];
                const end = i < headingIndices.length - 1 ? headingIndices[i + 1] : lines.length;
                
                const heading = lines[start].slice(0, -1); // Remove the colon
                const sectionLines = lines.slice(start + 1, end);
                
                // Check if this section has bullet points
                const bulletPoints = sectionLines.filter(l => 
                  l.trim().startsWith('-') || l.trim().startsWith('•')
                );
                
                if (bulletPoints.length > 0 && bulletPoints.length === sectionLines.length) {
                  // This section is all bullet points
                  result.push({
                    title: heading,
                    content: bulletPoints.map(bp => bp.replace(/^[-•]\s*/, '')),
                    type: "bulletPoints"
                  });
                } else if (bulletPoints.length > 0) {
                  // Mixed content - first add non-bullet content
                  const regularContent = sectionLines.filter(l => 
                    !l.trim().startsWith('-') && !l.trim().startsWith('•')
                  );
                  
                  if (regularContent.length > 0) {
                    result.push({
                      title: heading,
                      content: [regularContent.join('\n')],
                      type: "paragraph"
                    });
                  }
                  
                  // Then add bullet points if any
                  result.push({
                    title: "",  // No title for bullet portion
                    content: bulletPoints.map(bp => bp.replace(/^[-•]\s*/, '')),
                    type: "bulletPoints"
                  });
                } else {
                  // Regular paragraph section
                  result.push({
                    title: heading,
                    content: [sectionLines.join('\n')],
                    type: "paragraph"
                  });
                }
              }
            } else {
              // Check if this block has bullet points
              const bulletPoints = lines.filter(l => 
                l.trim().startsWith('-') || l.trim().startsWith('•')
              );
              
              if (bulletPoints.length > 0 && bulletPoints.length === lines.length) {
                // All bullet points
                result.push({
                  title: currentTitle,
                  content: bulletPoints.map(bp => bp.replace(/^[-•]\s*/, '')),
                  type: "bulletPoints"
                });
              } else if (bulletPoints.length > 0) {
                // Mixed content
                const regularLines = lines.filter(l => 
                  !l.trim().startsWith('-') && !l.trim().startsWith('•')
                );
                
                if (regularLines.length > 0) {
                  result.push({
                    title: currentTitle,
                    content: [regularLines.join('\n')],
                    type: "paragraph"
                  });
                }
                
                result.push({
                  title: "",
                  content: bulletPoints.map(bp => bp.replace(/^[-•]\s*/, '')),
                  type: "bulletPoints"
                });
              } else {
                // Regular paragraph
                result.push({
                  title: currentTitle,
                  content: [lines.join('\n')],
                  type: "paragraph"
                });
              }
            }
          });
          
          return result;
        };
        
        // Process the text content
        const parsedSections = parseTextContent(rawText);
        sections.push(...parsedSections);
        
        // Reset the current title
        currentTitle = "";
      }
    });
    
    // If we didn't generate any sections but have valid blocks, use a simple fallback
    if (sections.length === 0 && description.length > 0) {
      // Try a simple extraction of text from all blocks
      const allText = description.map(block => {
        if (block?.children && Array.isArray(block.children)) {
          return block.children.map(child => child.text || "").join('');
        }
        return "";
      }).filter(Boolean).join('\n\n');
      
      if (allText.trim()) {
        const paragraphs = allText.split(/\n\s*\n+/).filter(p => p.trim());
        return paragraphs.map(p => ({
          content: [p],
          type: "paragraph" as const
        }));
      }
    }
    
    // Merge adjacent paragraph sections with the same title for better display
    const mergedSections: FormattedSection[] = [];
    for (let i = 0; i < sections.length; i++) {
      const current = sections[i];
      
      // If this is a paragraph and the next one is also a paragraph with the same title, merge them
      if (current.type === "paragraph" && 
          i < sections.length - 1 && 
          sections[i+1].type === "paragraph" && 
          current.title === sections[i+1].title) {
        
        mergedSections.push({
          title: current.title,
          content: [...current.content, ...sections[i+1].content],
          type: "paragraph"
        });
        i++; // Skip the next section since we merged it
      }
      // Otherwise just add the current section
      else {
        mergedSections.push(current);
      }
    }
    
    return mergedSections.length > 0 ? mergedSections : sections;
  }
  
  // Fallback if we can't process the description
  return [{
    content: ["No description available"],
    type: "paragraph"
  }];
};

const getPrizeIcon = (iconName: string | undefined): React.ReactNode => {
  if (!iconName) return null;
  switch (iconName) {
    case "trophy":
      return <Trophy className="w-6 h-6" />;
    case "medal":
      return <Medal className="w-6 h-6" />;
    case "award":
      return <Award className="w-6 h-6" />;
    case "ai":
      return <Brain className="w-6 h-6" />;
    case "accessibility":
      return <AccessibilityIcon className="w-6 h-6" />;
    case "users":
      return <Users className="w-6 h-6" />;
    default:
      return <Award className="w-6 h-6" />;
  }
};
