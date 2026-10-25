// MOVA — Domain Types
// Central TypeScript domain model for MOVA People Discovery Platform

export type VisibilityLevel = 'PUBLIC' | 'PRIVATE' | 'VERIFIED_ONLY' | 'HIDDEN';
export type SourceType = 'SELF_REPORTED' | 'PUBLIC_SOURCE' | 'VERIFIED_SOURCE';
export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'UNVERIFIED';

export type PersonCategory =
  | 'artists-musicians'
  | 'actors-public-figures'
  | 'bloggers-creators'
  | 'athletes'
  | 'entrepreneurs'
  | 'developers'
  | 'scientists-experts'
  | 'business-leaders'
  | 'other-professionals';

export interface SocialAccount {
  platform: 'instagram' | 'twitter' | 'youtube' | 'tiktok' | 'linkedin' | 'github' | 'website' | 'spotify';
  url: string;
  handle?: string;
  followerCount?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  category?: string;
  icon?: string;
  highlighted?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'paused';
  tags: string[];
  url?: string;
  imageUrl?: string;
}

export interface TimelineEntry {
  id: string;
  year: number;
  title: string;
  organization?: string;
  description: string;
  type: 'career' | 'education' | 'award' | 'milestone';
  endYear?: number;
  current?: boolean;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  date?: string;
}

export interface CurrentActivity {
  label: string;
  description: string;
  updatedAt: string;
  visibility: VisibilityLevel;
}

export interface AppearanceData {
  heightCm?: number;
  weightKg?: number;
  hairColor?: string;
  eyeColor?: string;
  hairStyle?: string;
  skinTone?: string;
  appearanceNotes?: string;
  sourceType: SourceType;
  visibility: VisibilityLevel; // WEIGHT default is PRIVATE
}

export interface PersonVisibility {
  appearance: VisibilityLevel;
  currentActivity: VisibilityLevel;
  socialAccounts: VisibilityLevel;
  gallery: VisibilityLevel;
}

export interface Person {
  id: string;
  slug: string;
  fullName: string;
  professionalTitle: string;
  biography: string;
  shortBio: string;
  avatarUrl: string;
  coverImageUrl: string;
  categories: PersonCategory[];
  publicLocation?: string;
  verificationStatus: VerificationStatus;
  recognition?: string; // e.g. "Grammy Award Winner", "Forbes 30 Under 30"
  socialAccounts: SocialAccount[];
  achievements: Achievement[];
  projects: Project[];
  timeline: TimelineEntry[];
  gallery: GalleryImage[];
  currentActivity?: CurrentActivity;
  appearance?: AppearanceData;
  visibility: PersonVisibility;
  featuredOrder?: number; // lower = higher priority for featured section
  updatedAt: string;
  createdAt: string;
}

// Public-safe version — no private fields
export type PublicPerson = Omit<Person, 'appearance' | 'visibility'> & {
  appearance?: Pick<AppearanceData, 'heightCm' | 'hairColor' | 'eyeColor' | 'sourceType'>; // only public fields
};

export interface Category {
  id: PersonCategory;
  name: string;
  description: string;
  imageUrl: string;
  profileCount: number;
  accentColor: string;
}

export interface SearchFilters {
  query?: string;
  categories?: PersonCategory[];
  location?: string;
  verifiedOnly?: boolean;
  sortBy?: 'name' | 'featured' | 'updated';
}

export interface SearchResult {
  people: Person[];
  total: number;
  hasMore: boolean;
  page: number;
}

export interface ClaimRequest {
  profileSlug?: string;
  profileUrl?: string;
  claimantName: string;
  claimantEmail: string;
  claimantProfession: string;
  evidence: string;
  additionalInfo?: string;
}

export interface ClaimSubmissionResult {
  success: boolean;
  referenceId: string;
  message: string;
}
