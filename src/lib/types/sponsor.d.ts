export interface CreateSponsorDto {
  name: string;
  logoKey: string; // URL or uploaded file key
  websiteUrl?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  linkedInUrl?: string | null;
  description?: string | null;
}
export interface Sponsor {
  _id: string;
  name: string;
  logoKey: string;

  websiteUrl?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  linkedInUrl?: string | null;
  description?: string | null;

  eventId: string;
  representatives: any[]; // you can update to a proper type later
  createdBy: string;

  createdAt: string;
  updatedAt: string;
}
