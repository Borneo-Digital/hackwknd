"use client";

import React, { useMemo, useState } from "react";
import { Hackathon } from "@/types/hackathon";
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
  // ArrowRight,
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

interface HackathonPageProps {
  hackathon: Hackathon;
}

interface FormattedSection {
  title?: string;
  content: string[];
  type: "paragraph" | "bulletPoints";
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
  } = hackathon;

  const formattedDate = useMemo(
    () => formatDate(hackathonDate),
    [hackathonDate]
  );
  const formattedRegistrationEndDate = useMemo(
    () => formatDate(RegistrationEndDate),
    [RegistrationEndDate]
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  // const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

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
            <div className="flex items-center justify-center space-x-4">
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
                  <Image
                    src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${hackathonImage.url}`}
                    alt={Title}
                    width={hackathonImage.width}
                    height={hackathonImage.height}
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
                                  {paragraph}
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
                                  <span className="flex-1">{bullet}</span>
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
                                                                : place ===
                                                                  "second"
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

                  {Prizes.prizes.special && (
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
  className="bg-hack-primary text-white px-6 py-3 rounded-lg hover:bg-hack-primary/80 transition-all duration-300"
  onClick={() => window.open('https://forms.clickup.com/25542747/f/rbg2v-19256/HQQTCD0LFSC54LELAZ', '_blank')}
>
  Register Now
</Button>
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
  description: string
): FormattedSection[] => {
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
