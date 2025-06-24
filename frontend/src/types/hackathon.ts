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
    id?: string;
    rank: string;
    amount: number;
    description: string;
    icon: string;
  }
  
  export interface SpecialPrize {
    id?: string;
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
    main?: PrizeBenefit[];
    first?: PrizeBenefit;
    second?: PrizeBenefit;
    third?: PrizeBenefit;
    special?: SpecialPrize[] | SpecialCategories;
  }
  
  export interface Prizes {
    prizes: PrizesData;
  }

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TextNode {
  text: string;
  type?: string;
  bold?: boolean;
  italic?: boolean;
}

export interface BulletItem {
  children: TextNode[];
}

export interface HeadingBlock {
  type: 'heading';
  children: TextNode[];
}

export interface ParagraphBlock {
  type: 'paragraph';
  children: TextNode[];
}

export interface BulletListBlock {
  type: 'bullet-list';
  children: BulletItem[];
}

export type DescriptionBlock = HeadingBlock | ParagraphBlock | BulletListBlock;

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

export interface PartnershipLogo {
  id: string;
  url: string;
  name: string;
}

export interface PosterImage {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

export interface Hackathon {
  id: number;
  attributes: {
    Title: string;
    Theme: string;
    Date: string;
    Location: string;
    Duration?: string;
    Description: string | DescriptionBlock[]; // Can be string or blocks object
    Schedule: Schedule | null;
    Prizes: Prizes | null;
    FAQ: FAQItem[];
    slug: string;
    Image: {
      data: {
        id: number;
        attributes: Image;
      }[]
    } | string; // Support both legacy and direct URL formats
    PartnershipLogos?: PartnershipLogo[]; // Array of partnership logos
    PosterImages?: PosterImage[]; // Array of poster images for the gallery
    EventStatus: string; // Date string in the backend
    RegistrationEndDate: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }
}
