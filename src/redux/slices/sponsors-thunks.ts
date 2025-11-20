import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  Sponsor,
  CreateSponsorDto,
  CreateSponsorDto as UpdateSponsorDto,
} from '@/lib/types/sponsor';
import { SponsorService } from '@/services/sponsors.service';

interface ThunkApiConfig {
  rejectValue: string;
}

/* ───────────────────────────────────────────────
   Fetch Sponsors
─────────────────────────────────────────────── */
export const fetchSponsors = createAsyncThunk<
  Sponsor[],
  void,
  { rejectValue: string }
>('sponsors/fetch', async (_, thunkAPI) => {
  try {
    const state: any = thunkAPI.getState();
    const eventId = state.sponsors.eventId;

    if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

    const res = await SponsorService.getAll(eventId);
    return res.data.results;
  } catch {
    return thunkAPI.rejectWithValue('Failed to fetch sponsors');
  }
});

/* ───────────────────────────────────────────────
   Create Sponsor (with logo + document upload)
─────────────────────────────────────────────── */
export const createSponsor = createAsyncThunk<
  Sponsor,
  {
    eventId: string;
    data: CreateSponsorDto;
    logoFile?: File | null;
    documentFile?: File | null;
  },
  ThunkApiConfig
>(
  'sponsors/create',
  async ({ eventId, data, logoFile, documentFile }, thunkAPI) => {
    try {
      const result = await SponsorService.create(eventId, data);
      const sponsor = result.data as Sponsor;
      const sponsorId = sponsor._id;

      let logoKey: string | null = null;
      let documentKey: string | null = null;

      if (logoFile) {
        const uploadMeta = await SponsorService.getUploadUrl({
          eventId,
          sponsorId,
          contentType: logoFile.type,
          type: 'logo',
        });

        await fetch(uploadMeta.data.uploadUrl, { method: 'PUT', body: logoFile });
        logoKey = uploadMeta.data.key;
      }

      if (documentFile) {
        const uploadMeta = await SponsorService.getUploadUrl({
          eventId,
          sponsorId,
          contentType: documentFile.type,
          type: 'document',
        });

        await fetch(uploadMeta.data.uploadUrl, { method: 'PUT', body: documentFile });
        documentKey = uploadMeta.data.key;
      }

      await SponsorService.update(eventId, sponsorId, {
        ...data,
        ...(logoKey ? { logoKey } : {}),
        ...(documentKey ? { documentKey } : {}),
      });

      return sponsor;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to create sponsor');
    }
  }
);

/* ───────────────────────────────────────────────
   Update Sponsor
─────────────────────────────────────────────── */
export const updateSponsor = createAsyncThunk<
  Sponsor,
  { eventId: string; id: string; payload: UpdateSponsorDto },
  ThunkApiConfig
>('sponsors/update', async ({ eventId, id, payload }, thunkAPI) => {
  try {
    const result = await SponsorService.update(eventId, id, payload);
    return result.data as Sponsor;
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to update sponsor');
  }
});

/* ───────────────────────────────────────────────
   Delete Sponsor
─────────────────────────────────────────────── */
export const deleteSponsor = createAsyncThunk<
  string,
  { eventId: string; id: string },
  ThunkApiConfig
>('sponsors/delete', async ({ eventId, id }, thunkAPI) => {
  try {
    await SponsorService.remove(eventId, id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to delete sponsor');
  }
});
