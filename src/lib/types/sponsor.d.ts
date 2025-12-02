export interface CreateSponsorDto {
  name: string;
  logoKey: string; // URL or uploaded file key
  websiteUrl: string;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl: string;
  linkedInUrl?: string | null;
  description: string;
  email: string | null;
}
export interface Sponsor {
  _id: string;
  name: string;
  logoKey: string;
  email: string;
  websiteUrl: string;
  youtubeUrl?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  linkedInUrl?: string | null;
  description: string;

  eventId: string;
  representatives: any[]; // you can update to a proper type later
  createdBy: string;

  createdAt: string;
  updatedAt: string;
}
