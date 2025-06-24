'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { use } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduleDay, ScheduleEvent, FAQItem } from '@/types/hackathon';

interface Prize {
  id: string;
  rank: string;
  amount: number;
  description: string;
  icon: string;
}

interface SpecialPrize {
  id: string;
  rank: string;
  amount: number;
  description: string;
  icon: string;
}

interface HackathonAdvancedProps {
  params: Promise<{ id: string }>;
}

export default function HackathonAdvancedPage({ params }: HackathonAdvancedProps) {
  const router = useRouter();
  const { id } = use(params);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hackathonTitle, setHackathonTitle] = useState('');
  
  // Schedule state
  const [scheduleDays, setScheduleDays] = useState<ScheduleDay[]>([]);
  
  // Prizes state
  const [mainPrizes, setMainPrizes] = useState<Prize[]>([
    {
      id: 'first-place',
      rank: 'First Place',
      amount: 5000,
      description: 'Winner of the hackathon',
      icon: 'trophy'
    },
    {
      id: 'second-place',
      rank: 'Second Place',
      amount: 3000,
      description: 'Runner-up',
      icon: 'medal'
    },
    {
      id: 'third-place',
      rank: 'Third Place',
      amount: 1000,
      description: 'Third place winner',
      icon: 'award'
    }
  ]);
  
  // Special prizes state
  const [specialPrizes, setSpecialPrizes] = useState<SpecialPrize[]>([
    {
      id: 'llm',
      rank: 'Best LLM Use',
      amount: 500,
      description: 'Best use of language models',
      icon: 'brain'
    },
    {
      id: 'accessibility',
      rank: 'Best Accessibility',
      amount: 500,
      description: 'Most accessible solution',
      icon: 'accessibility'
    },
    {
      id: 'peoples-choice',
      rank: 'People\'s Choice',
      amount: 500,
      description: 'Voted by participants',
      icon: 'users'
    }
  ]);
  
  // FAQ state
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);

  useEffect(() => {
    async function fetchHackathon() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('hackathons')
          .select('title, schedule, prizes, faq')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setHackathonTitle(data.title || 'Hackathon');
          
          // Parse schedule
          if (data.schedule) {
            try {
              const scheduleData = JSON.parse(data.schedule);
              if (scheduleData.schedule && Array.isArray(scheduleData.schedule)) {
                setScheduleDays(scheduleData.schedule);
              }
            } catch (e) {
              console.error('Error parsing schedule:', e);
            }
          }
          
          // Parse prizes
          if (data.prizes) {
            try {
              const prizesData = JSON.parse(data.prizes);
              
              // Handle main prizes
              if (prizesData.prizes) {
                const loadedMainPrizes: Prize[] = [];
                
                // Legacy format conversion (object to array)
                if (prizesData.prizes.first) {
                  loadedMainPrizes.push({
                    id: 'first-place',
                    ...prizesData.prizes.first
                  });
                }
                
                if (prizesData.prizes.second) {
                  loadedMainPrizes.push({
                    id: 'second-place',
                    ...prizesData.prizes.second
                  });
                }
                
                if (prizesData.prizes.third) {
                  loadedMainPrizes.push({
                    id: 'third-place',
                    ...prizesData.prizes.third
                  });
                }
                
                // New format (array)
                if (prizesData.prizes.main && Array.isArray(prizesData.prizes.main)) {
                  setMainPrizes(prizesData.prizes.main);
                } else if (loadedMainPrizes.length > 0) {
                  // Use converted legacy format
                  setMainPrizes(loadedMainPrizes);
                }
                
                // Special prizes
                if (prizesData.prizes.special) {
                  // If special is an array, use it directly
                  if (Array.isArray(prizesData.prizes.special)) {
                    setSpecialPrizes(prizesData.prizes.special);
                  } 
                  // Convert legacy object format to array
                  else {
                    const specialPrizesArray: SpecialPrize[] = Object.entries(prizesData.prizes.special).map(
                      ([key, value]: [string, unknown]) => ({
                        id: key,
                        ...(value as Omit<SpecialPrize, 'id'>)
                      })
                    );
                    setSpecialPrizes(specialPrizesArray);
                  }
                }
              }
            } catch (e) {
              console.error('Error parsing prizes:', e);
            }
          }
          
          // Parse FAQ
          if (data.faq) {
            try {
              const faqData = JSON.parse(data.faq);
              if (Array.isArray(faqData)) {
                setFaqItems(faqData);
              }
            } catch (e) {
              console.error('Error parsing FAQ:', e);
            }
          }
        }
      } catch (err: unknown) {
        console.error('Error fetching hackathon:', err);
        setError((err as Error).message || 'Failed to load hackathon details');
      } finally {
        setIsLoading(false);
      }
    }

    fetchHackathon();
  }, [id]);

  // Schedule handlers
  const addScheduleDay = () => {
    setScheduleDays([...scheduleDays, {
      day: `Day ${scheduleDays.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      events: []
    }]);
  };

  const updateScheduleDay = <K extends keyof ScheduleDay>(index: number, field: K, value: ScheduleDay[K]) => {
    const newDays = [...scheduleDays];
    newDays[index] = { ...newDays[index], [field]: value };
    setScheduleDays(newDays);
  };

  const removeScheduleDay = (index: number) => {
    setScheduleDays(scheduleDays.filter((_, i) => i !== index));
  };

  const addEvent = (dayIndex: number) => {
    const newDays = [...scheduleDays];
    newDays[dayIndex].events.push({
      time: '09:00 AM',
      event: 'New Event',
      description: ''
    });
    setScheduleDays(newDays);
  };

  const updateEvent = (dayIndex: number, eventIndex: number, field: keyof ScheduleEvent, value: string) => {
    const newDays = [...scheduleDays];
    newDays[dayIndex].events[eventIndex] = { 
      ...newDays[dayIndex].events[eventIndex], 
      [field]: value 
    };
    setScheduleDays(newDays);
  };

  const removeEvent = (dayIndex: number, eventIndex: number) => {
    const newDays = [...scheduleDays];
    newDays[dayIndex].events = newDays[dayIndex].events.filter((_, i) => i !== eventIndex);
    setScheduleDays(newDays);
  };

  // FAQ handlers
  const addFaqItem = () => {
    setFaqItems([...faqItems, { question: 'New Question', answer: 'Answer to the question' }]);
  };

  const updateFaqItem = (index: number, field: keyof FAQItem, value: string) => {
    const newItems = [...faqItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setFaqItems(newItems);
  };

  const removeFaqItem = (index: number) => {
    setFaqItems(faqItems.filter((_, i) => i !== index));
  };

  // Prize handlers
  const addPrize = () => {
    const newId = `prize-${Date.now()}`;
    setMainPrizes([...mainPrizes, {
      id: newId,
      rank: 'New Prize',
      amount: 500,
      description: 'Add description here',
      icon: 'trophy'
    }]);
  };

  const updatePrize = (prizeId: string, field: keyof Prize, value: string | number) => {
    setMainPrizes(mainPrizes.map(prize => 
      prize.id === prizeId ? { ...prize, [field]: value } : prize
    ));
  };

  const removePrize = (prizeId: string) => {
    setMainPrizes(mainPrizes.filter(prize => prize.id !== prizeId));
  };

  const addSpecialPrize = () => {
    const newId = `special-${Date.now()}`;
    setSpecialPrizes([...specialPrizes, {
      id: newId,
      rank: 'New Special Category',
      amount: 300,
      description: 'Add description here',
      icon: 'award'
    }]);
  };

  const updateSpecialPrize = (prizeId: string, field: keyof SpecialPrize, value: string | number) => {
    setSpecialPrizes(specialPrizes.map(prize => 
      prize.id === prizeId ? { ...prize, [field]: value } : prize
    ));
  };

  const removeSpecialPrize = (prizeId: string) => {
    setSpecialPrizes(specialPrizes.filter(prize => prize.id !== prizeId));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Prepare data
      const scheduleData = { schedule: scheduleDays };
      const prizesData = {
        prizes: {
          main: mainPrizes,
          special: specialPrizes
        }
      };

      // Update in Supabase
      const { error } = await supabase
        .from('hackathons')
        .update({
          schedule: JSON.stringify(scheduleData),
          prizes: JSON.stringify(prizesData),
          faq: JSON.stringify(faqItems)
        })
        .eq('id', id);

      if (error) throw error;
      
      setSuccessMessage('Settings saved successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: unknown) {
      console.error('Error saving advanced settings:', err);
      setError((err as Error).message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <svg className="animate-spin h-10 w-10 mx-auto text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-muted-foreground">Loading advanced settings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Advanced Settings</h1>
            <p className="text-muted-foreground">{hackathonTitle}</p>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => router.push(`/admin/hackathons/${id}`)}
              className="px-4 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Back to Hackathon
            </button>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-600 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700 dark:text-green-300">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400 dark:text-red-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card rounded-lg shadow-md">
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="border-b border-border px-6 py-2">
            <TabsTrigger value="schedule" className="px-4 py-2 text-sm font-medium">Schedule</TabsTrigger>
            <TabsTrigger value="prizes" className="px-4 py-2 text-sm font-medium">Prizes</TabsTrigger>
            <TabsTrigger value="faq" className="px-4 py-2 text-sm font-medium">FAQ</TabsTrigger>
          </TabsList>
          
          {/* SCHEDULE TAB */}
          <TabsContent value="schedule" className="p-6">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">Event Schedule</h2>
              <button
                type="button"
                onClick={addScheduleDay}
                className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Add Day
              </button>
            </div>

            <div className="space-y-6">
              {scheduleDays.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No schedule days added yet. Add a day to start building your event schedule.</p>
                </div>
              ) : (
                scheduleDays.map((day, dayIndex) => (
                  <div key={dayIndex} className="border border-input rounded-md p-4 bg-card">
                    <div className="flex justify-between items-center mb-4">
                      <div className="grid grid-cols-2 gap-4 flex-grow mr-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Day Name
                          </label>
                          <input
                            type="text"
                            value={day.day}
                            onChange={(e) => updateScheduleDay(dayIndex, 'day', e.target.value)}
                            className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            value={day.date.split('T')[0]}
                            onChange={(e) => updateScheduleDay(dayIndex, 'date', e.target.value)}
                            className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeScheduleDay(dayIndex)}
                        className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/30"
                      >
                        Remove
                      </button>
                    </div>

                    <h4 className="font-medium text-foreground mb-2">Events</h4>
                    
                    <div className="space-y-3">
                      {day.events.map((event, eventIndex) => (
                        <div key={eventIndex} className="grid grid-cols-12 gap-2 items-center bg-muted/30 p-2 rounded-md">
                          <div className="col-span-2">
                            <input
                              type="text"
                              placeholder="Time"
                              value={event.time}
                              onChange={(e) => updateEvent(dayIndex, eventIndex, 'time', e.target.value)}
                              className="w-full px-2 py-1 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-input"
                            />
                          </div>
                          <div className="col-span-4">
                            <input
                              type="text"
                              placeholder="Event Name"
                              value={event.event}
                              onChange={(e) => updateEvent(dayIndex, eventIndex, 'event', e.target.value)}
                              className="w-full px-2 py-1 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-input"
                            />
                          </div>
                          <div className="col-span-5">
                            <input
                              type="text"
                              placeholder="Description (optional)"
                              value={event.description || ''}
                              onChange={(e) => updateEvent(dayIndex, eventIndex, 'description', e.target.value)}
                              className="w-full px-2 py-1 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-input"
                            />
                          </div>
                          <div className="col-span-1 text-right">
                            <button
                              type="button"
                              onClick={() => removeEvent(dayIndex, eventIndex)}
                              className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => addEvent(dayIndex)}
                      className="mt-3 px-3 py-1 text-sm bg-muted text-muted-foreground rounded-md hover:bg-muted/80"
                    >
                      Add Event
                    </button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          {/* PRIZES TAB */}
          <TabsContent value="prizes" className="p-6">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">Prizes</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-foreground">Main Prizes</h3>
                  <button
                    type="button"
                    onClick={addPrize}
                    className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Add Prize
                  </button>
                </div>
                
                {mainPrizes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border border-dashed border-input rounded-md">
                    <p>No prizes added yet. Click the button above to add your first prize.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mainPrizes.map((prize, index) => {
                      // Get different colors based on the index
                      let borderColor = "border-gray-200 dark:border-gray-700";
                      let bgColor = "bg-gray-50 dark:bg-gray-800/30";
                      
                      if (index === 0) {
                        borderColor = "border-yellow-200 dark:border-yellow-900/50";
                        bgColor = "bg-yellow-50 dark:bg-yellow-900/20";
                      } else if (index === 1) {
                        borderColor = "border-slate-200 dark:border-slate-700";
                        bgColor = "bg-slate-50 dark:bg-slate-800/30";
                      } else if (index === 2) {
                        borderColor = "border-amber-200 dark:border-amber-900/50";
                        bgColor = "bg-amber-50 dark:bg-amber-900/20";
                      }
                      
                      return (
                        <div key={prize.id} className={`border ${borderColor} ${bgColor} rounded-md p-4`}>
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium">{prize.rank}</h4>
                            <button
                              type="button"
                              onClick={() => removePrize(prize.id)}
                              className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                            >
                              ×
                            </button>
                          </div>
                          
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Prize Title
                            </label>
                            <input
                              type="text"
                              value={prize.rank}
                              onChange={(e) => updatePrize(prize.id, 'rank', e.target.value)}
                              className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
                            />
                          </div>
                          
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Amount (RM) - Enter 0 for non-monetary prizes
                            </label>
                            <input
                              type="number"
                              value={prize.amount}
                              onChange={(e) => updatePrize(prize.id, 'amount', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
                            />
                          </div>
                          
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Description
                            </label>
                            <input
                              type="text"
                              value={prize.description}
                              onChange={(e) => updatePrize(prize.id, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
                            />
                          </div>
                          
                          <div className="mb-1">
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Icon
                            </label>
                            <select
                              value={prize.icon}
                              onChange={(e) => updatePrize(prize.id, 'icon', e.target.value)}
                              className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
                            >
                              <option value="trophy">Trophy</option>
                              <option value="medal">Medal</option>
                              <option value="award">Award</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-foreground">Special Categories</h3>
                  <button
                    type="button"
                    onClick={addSpecialPrize}
                    className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Add Special Prize
                  </button>
                </div>
                
                {specialPrizes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border border-dashed border-input rounded-md">
                    <p>No special prizes added yet. Click the button above to add a special category prize.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {specialPrizes.map((prize, index) => {
                      // Rotate through different colors
                      const colors = [
                        { border: "border-indigo-200 dark:border-indigo-900/50", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
                        { border: "border-green-200 dark:border-green-900/50", bg: "bg-green-50 dark:bg-green-900/20" },
                        { border: "border-purple-200 dark:border-purple-900/50", bg: "bg-purple-50 dark:bg-purple-900/20" },
                        { border: "border-blue-200 dark:border-blue-900/50", bg: "bg-blue-50 dark:bg-blue-900/20" },
                        { border: "border-pink-200 dark:border-pink-900/50", bg: "bg-pink-50 dark:bg-pink-900/20" }
                      ];
                      
                      const colorIndex = index % colors.length;
                      const { border, bg } = colors[colorIndex];
                      
                      return (
                        <div key={prize.id} className={`border ${border} ${bg} rounded-md p-4`}>
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium">{prize.rank}</h4>
                            <button
                              type="button"
                              onClick={() => removeSpecialPrize(prize.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                          
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Prize Title
                            </label>
                            <input
                              type="text"
                              value={prize.rank}
                              onChange={(e) => updateSpecialPrize(prize.id, 'rank', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Amount (RM) - Enter 0 for non-monetary prizes
                            </label>
                            <input
                              type="number"
                              value={prize.amount}
                              onChange={(e) => updateSpecialPrize(prize.id, 'amount', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <input
                              type="text"
                              value={prize.description}
                              onChange={(e) => updateSpecialPrize(prize.id, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          
                          <div className="mb-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Icon
                            </label>
                            <select
                              value={prize.icon}
                              onChange={(e) => updateSpecialPrize(prize.id, 'icon', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                              <option value="brain">Brain</option>
                              <option value="accessibility">Accessibility</option>
                              <option value="users">Users</option>
                              <option value="award">Award</option>
                              <option value="trophy">Trophy</option>
                              <option value="medal">Medal</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* FAQ TAB */}
          <TabsContent value="faq" className="p-6">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">Frequently Asked Questions</h2>
              <button
                type="button"
                onClick={addFaqItem}
                className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Add Question
              </button>
            </div>

            <div className="space-y-4">
              {faqItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No FAQ items added yet. Add questions to help participants understand your event better.</p>
                </div>
              ) : (
                faqItems.map((item, index) => (
                  <div key={index} className="border border-input rounded-md p-4 bg-card">
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Answer
                      </label>
                      <textarea
                        rows={3}
                        value={item.answer}
                        onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeFaqItem(index)}
                        className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/30"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="p-6 border-t border-border flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push(`/admin/hackathons/${id}`)}
            className="px-4 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}