// utils/sponsor.mapper.ts
import { Sponsor } from '@/lib/types/sponsor';

export interface SponsorRow {
  id: string;
  name: string;
  logoUrl?: string;
  youtubeUrl?: string;
  websiteUrl?: string;
  email?: string;
  phone?: string;
  status?: string;
  linkedInUrl?: string;
  description?: string;
}

export function mapSponsorToRow(sponsor: Sponsor): SponsorRow {
  return {
    id: sponsor._id,
    name: sponsor.name,
    logoUrl: sponsor.logoKey ? `/uploads/${sponsor.logoKey}` : undefined, // adjust path if needed
    websiteUrl: sponsor.websiteUrl ?? '',
    description: sponsor.description ?? '',
    youtubeUrl: sponsor.youtubeUrl ?? '',
    linkedInUrl: sponsor.linkedInUrl ?? '',
  };
}
