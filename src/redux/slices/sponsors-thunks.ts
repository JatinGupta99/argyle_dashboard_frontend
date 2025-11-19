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
  string,
  ThunkApiConfig
>('sponsors/fetchAll', async (eventId, thunkAPI) => {
  try {
    const result = await SponsorService.getAll(eventId);
    return result.data as Sponsor[];
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to fetch sponsors');
  }
});

/* ───────────────────────────────────────────────
   Create Sponsor
─────────────────────────────────────────────── */
export const createSponsor = createAsyncThunk<
  Sponsor,
  { eventId: string; payload: CreateSponsorDto },
  ThunkApiConfig
>('sponsors/create', async ({ eventId, payload }, thunkAPI) => {
  try {
    const result = await SponsorService.create(eventId, payload);
    return result.data as Sponsor;
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to create sponsor');
  }
});

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
