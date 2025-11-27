// src/redux/slices/sponsorSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Sponsor, CreateSponsorDto } from '@/lib/types/sponsor';
import { SponsorService } from '@/services/sponsors.service';
import { RootState } from '../store';

/* ───────────────────────────────────────────────
   State
──────────────────────────────────────────────── */
interface SponsorState {
  items: Sponsor[];
  loading: boolean;
  error: string | null;

  eventId: string;

  formOpen: boolean;
  editing: Sponsor | null;

  deleteTarget: Sponsor | null;

  meta?: { total: number; page: number; limit: number; totalPages: number };
}

const initialState: SponsorState = {
  items: [],
  loading: false,
  error: null,

  eventId: '',

  formOpen: false,
  editing: null,

  deleteTarget: null,

  meta: undefined,
};

/* ───────────────────────────────────────────────
   File Upload Helper
──────────────────────────────────────────────── */
async function uploadFile(
  eventId: string,
  sponsorId: string,
  file: File | null,
  type: 'logo' | 'document'
): Promise<string | null> {
  if (!file) return null;

  const res = await SponsorService.getUploadUrl({ eventId, sponsorId, contentType: file.type, type });
  const { key, uploadUrl } = res.data;

  await fetch(uploadUrl, { method: 'PUT', body: file });
  return key;
}

/* ───────────────────────────────────────────────
   Fetch Sponsors
──────────────────────────────────────────────── */
export const fetchSponsors = createAsyncThunk<
  { data: Sponsor[]; total: number; page: number; limit: number; totalPages: number },
  { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' } | undefined,
  { rejectValue: string; state: RootState }
>(
  'sponsors/fetch',
  async (args = {}, thunkAPI) => {
    const { page = 1, limit = 10, search = '', sortBy, sortOrder } = args || {};
    const state = thunkAPI.getState();
    const eventId = state.sponsors.eventId;

    if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

    try {
      const res = await SponsorService.getAll(eventId, { page, limit, search, sortBy, sortOrder });
      return res;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.message ?? 'Failed to fetch sponsors');
    }
  }
);

/* ───────────────────────────────────────────────
   Create Sponsor
──────────────────────────────────────────────── */
export const createSponsor = createAsyncThunk<
  Sponsor,
  { data: CreateSponsorDto; logoFile?: File | null; documentFile?: File | null },
  { rejectValue: string; state: RootState }
>(
  'sponsors/create',
  async ({ data, logoFile, documentFile }, thunkAPI) => {
    const state = thunkAPI.getState();
    const eventId = state.sponsors.eventId;
    if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

    try {
      const res = await SponsorService.create(eventId, data);
      const sponsor = res.data as Sponsor;

      const logoKey = await uploadFile(eventId, sponsor._id, logoFile ?? null, 'logo');
      const documentKey = await uploadFile(eventId, sponsor._id, documentFile ?? null, 'document');

      const payload: any = { ...data };
      if (logoKey) payload.logoKey = logoKey;
      if (documentKey) payload.documents = [documentKey];

      if (logoKey || documentKey) {
        const patch = await SponsorService.update(eventId, sponsor._id, payload);
        return patch.data;
      }

      return sponsor;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.message ?? 'Failed to create sponsor');
    }
  }
);

/* ───────────────────────────────────────────────
   Update Sponsor
──────────────────────────────────────────────── */
export const updateSponsor = createAsyncThunk<
  Sponsor,
  { sponsorId: string; data: CreateSponsorDto; logoFile?: File | null; documentFile?: File | null },
  { rejectValue: string; state: RootState }
>(
  'sponsors/update',
  async ({ sponsorId, data, logoFile, documentFile }, thunkAPI) => {
    const state = thunkAPI.getState();
    const eventId = state.sponsors.eventId;
    if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

    try {
      const logoKey = await uploadFile(eventId, sponsorId, logoFile ?? null, 'logo');
      const documentKey = await uploadFile(eventId, sponsorId, documentFile ?? null, 'document');

      const payload: any = { ...data };
      if (logoKey) payload.logoKey = logoKey;
      if (documentKey) payload.$push = { documents: documentKey };

      const res = await SponsorService.update(eventId, sponsorId, payload);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.message ?? 'Failed to update sponsor');
    }
  }
);

/* ───────────────────────────────────────────────
   Delete Sponsor
──────────────────────────────────────────────── */
export const deleteSponsor = createAsyncThunk<
  string,
  string,
  { rejectValue: string; state: RootState }
>(
  'sponsors/delete',
  async (sponsorId, thunkAPI) => {
    const state = thunkAPI.getState();
    const eventId = state.sponsors.eventId;
    if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

    try {
      await SponsorService.remove(eventId, sponsorId);
      return sponsorId;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.message ?? 'Failed to delete sponsor');
    }
  }
);

/* ───────────────────────────────────────────────
   Slice
──────────────────────────────────────────────── */
const sponsorSlice = createSlice({
  name: 'sponsors',
  initialState,
  reducers: {
    openForm(state, action: PayloadAction<true | Sponsor>) {
      state.formOpen = true;
      state.editing = action.payload === true ? null : action.payload;
    },
    closeForm(state) {
      state.formOpen = false;
      state.editing = null;
    },
    setSponsorEventId(state, action: PayloadAction<string>) {
      state.eventId = action.payload;
    },
    setDeleteTarget(state, action: PayloadAction<Sponsor | null>) {
      state.deleteTarget = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchSponsors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSponsors.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.meta = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchSponsors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load sponsors';
      })

      // CREATE
      .addCase(createSponsor.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // UPDATE
      .addCase(updateSponsor.fulfilled, (state, action) => {
        state.items = state.items.map((i) => (i._id === action.payload._id ? action.payload : i));
      })

      // DELETE
      .addCase(deleteSponsor.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload);
      });
  },
});

export const { openForm, closeForm, setSponsorEventId, setDeleteTarget } = sponsorSlice.actions;
export default sponsorSlice.reducer;
