export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
}

export interface HeroSectionContent {
  id: string;
  enabled: boolean;
  headlineLine1: string;
  headlineLine2: string;
  subtitle: string;
  closingHeadline: string;
  exploreText: string;
  posterUrl: string;
  videoUrl?: string;
  totalFrames: number;
  frameBasePath: string;
  mode?: "cinematic" | "frames";
  cinematicImageUrl?: string;
}

export interface StudioIntroSectionContent {
  id: string;
  enabled: boolean;
  label: string;
  title: string;
  descriptionParagraphs: string[];
  locations: string;
  stats: Array<{
    id: string;
    value: string;
    label: string;
    sublabel?: string;
  }>;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  features: string[];
  icon: string;
}

export interface ServicesSectionContent {
  id: string;
  enabled: boolean;
  label: string;
  title: string;
  subtitle: string;
  items: ServiceItem[];
}

export interface NfcCardItem {
  id: string;
  name: string;
  material: string;
  color: string;
  accentColor: string;
  surfaceFinish: string;
  description: string;
  badge: string;
  weight: string;
}

export interface NfcShowcaseSectionContent {
  id: string;
  enabled: boolean;
  label: string;
  title: string;
  subtitle: string;
  cards: NfcCardItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  link?: string;
  isConcept: boolean;
  deliverables: string[];
  year: string;
}

export interface WorkSectionContent {
  id: string;
  enabled: boolean;
  label: string;
  title: string;
  subtitle: string;
  projects: ProjectItem[];
}

export interface ProcessStep {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  duration?: string;
}

export interface ProcessSectionContent {
  id: string;
  enabled: boolean;
  label: string;
  title: string;
  subtitle: string;
  steps: ProcessStep[];
}

export interface TestimonialItem {
  id: string;
  author: string;
  role: string;
  company: string;
  avatarText: string;
  quote: string;
  approved: boolean;
}

export interface TestimonialsSectionContent {
  id: string;
  enabled: boolean;
  label: string;
  title: string;
  subtitle: string;
  items: TestimonialItem[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FaqSectionContent {
  id: string;
  enabled: boolean;
  label: string;
  title: string;
  subtitle: string;
  items: FaqItem[];
}

export interface ContactSectionContent {
  id: string;
  enabled: boolean;
  label: string;
  title: string;
  subtitle: string;
  email: string;
  secondaryEmail?: string;
  availabilityStatus: string;
  responseTimeNotice: string;
}

export interface FooterSectionContent {
  id: string;
  enabled: boolean;
  wordmark: string;
  tagline: string;
  copyrightText: string;
  locationNotice: string;
}

export interface BrandSettings {
  wordmark: string;
  accentColor: string; // e.g. #c6f36b
  contactEmail: string;
  navItems: NavItem[];
  socialLinks: SocialLink[];
}

export interface SeoMetadata {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;
}

export type SectionType = 
  | "hero"
  | "studioIntro"
  | "services"
  | "nfcShowcase"
  | "work"
  | "process"
  | "testimonials"
  | "faq"
  | "contact";

export interface SiteContent {
  brand: BrandSettings;
  seo: SeoMetadata;
  sectionOrder: SectionType[];
  sections: {
    hero: HeroSectionContent;
    studioIntro: StudioIntroSectionContent;
    services: ServicesSectionContent;
    nfcShowcase: NfcShowcaseSectionContent;
    work: WorkSectionContent;
    process: ProcessSectionContent;
    testimonials: TestimonialsSectionContent;
    faq: FaqSectionContent;
    contact: ContactSectionContent;
    footer: FooterSectionContent;
  };
  revision?: number;
  updatedAt?: string;
}
