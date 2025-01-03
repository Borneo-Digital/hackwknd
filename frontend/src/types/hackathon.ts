export interface ScheduleItem {
  time: string;
  event: string;
  description?: string;
}

export interface ScheduleEvent {
  event: string;
  time: string;
  description?: string;
  duration?: string;
}

export interface ScheduleDay {
  day: string;
  date: string;
  events: ScheduleEvent[];
}

export interface Schedule {
  schedule: ScheduleDay[];
}

export interface PrizeBenefit {
    rank: string;
    amount: number;
    description: string;
    icon: string;
  }
  
  export interface SpecialPrize {
    rank: string;
    amount: number;
    description: string;
    icon: string;
  }
  
  export interface SpecialCategories {
    llm: SpecialPrize;
    accessibility: SpecialPrize;
    peoples_choice: SpecialPrize;
  }
  
  export interface PrizesData {
    first: PrizeBenefit;
    second: PrizeBenefit;
    third: PrizeBenefit;
    special: SpecialCategories;
  }
  
  export interface Prizes {
    prizes: PrizesData;
  }

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface Image {
  url: string;
  width: number;
  height: number;
  formats: {
    thumbnail: ImageFormat;
    small: ImageFormat;
    medium: ImageFormat;
  };
}

export interface Hackathon {
  id: number;
  documentId: string;
  Title: string;
  Theme: string;
  Date: string;
  Location: string;
  Description: string;
  Schedule: Schedule | null;
  Prizes: Prizes | null;
  FAQ: FAQItem[];
  slug: string;
  Image: Image;
  EventStatus: "Upcoming" | "Ongoing" | "Completed";
  RegistrationStartDate: string;
  RegistrationEndDate: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
