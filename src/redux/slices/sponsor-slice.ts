// src/redux/slices/sponsorSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Sponsor, CreateSponsorDto } from '@/lib/types/sponsor';
import { SponsorService } from '@/services/sponsors.service';

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
}

const initialState: SponsorState = {
  items: [],
  loading: false,
  error: null,

  eventId: '',

  formOpen: false,
  editing: null,

  deleteTarget: null,
};

/* ───────────────────────────────────────────────
   File Upload Helper (Corrected)
──────────────────────────────────────────────── */
async function uploadFile(
  eventId: string,
  sponsorId: string,
  file: File | null,
  type: 'logo' | 'document'
): Promise<string | null> {
  if (!file) return null;

  const { data } = await SponsorService.getUploadUrl({
    eventId,
    sponsorId,
    contentType: file.type,
    type,
  });

  await fetch(data.url, {
    method: 'PUT',
    body: file,
  });

  return data.key;
}

/* ───────────────────────────────────────────────
   Fetch Sponsors
──────────────────────────────────────────────── */
export const fetchSponsors = createAsyncThunk<
  Sponsor[],
  void,
  { rejectValue: string }
>('sponsors/fetch', async (_, thunkAPI) => {
  try {
    const state: any = thunkAPI.getState();
    const eventId = state.sponsors?.eventId;

    if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

    const res = await SponsorService.getAll(eventId);
    console.log('acsnlkascnlacsnlsc',res);
    return res.data.results;
  } catch {
    return thunkAPI.rejectWithValue('Failed to fetch sponsors');
  }
});
/* ───────────────────────────────────────────────
   Create Sponsor (Corrected)
──────────────────────────────────────────────── */
export const createSponsor = createAsyncThunk<
  Sponsor,
  {
    eventId: string;
    data: CreateSponsorDto;
    logoFile: File | null;
    documentFile: File | null;
  },
  { rejectValue: string }
>('sponsors/create', async ({ eventId, data, logoFile, documentFile }, thunkAPI) => {
  try {
    // 1. CREATE sponsor first
    const res = await SponsorService.create(eventId, data);
    const sponsor = res.data;

    // 2. UPLOAD files
    const logoKey = await uploadFile(eventId, sponsor._id, logoFile, 'logo');
    const documentKey = await uploadFile(eventId, sponsor._id, documentFile, 'document');

    // 3. PATCH if needed
    if (logoKey || documentKey) {
      const patch = await SponsorService.update(eventId, sponsor._id, {
        ...data,
        ...(logoKey && { logoKey }),
        ...(documentKey && { documentKey }),
      });
      return patch.data;
    }

    return sponsor;
  } catch {
    return thunkAPI.rejectWithValue('Failed to create sponsor');
  }
});

/* ───────────────────────────────────────────────
   Update Sponsor
──────────────────────────────────────────────── */
export const updateSponsor = createAsyncThunk<
  Sponsor,
  {
    eventId: string;
    sponsorId: string;
    data: CreateSponsorDto;
    logoFile: File | null;
    documentFile: File | null;
  },
  { rejectValue: string }
>('sponsors/update', async ({ eventId, sponsorId, data, logoFile, documentFile }, thunkAPI) => {
  try {
    const logoKey = await uploadFile(eventId, sponsorId, logoFile, 'logo');
    const documentKey = await uploadFile(eventId, sponsorId, documentFile, 'document');

    const payload = {
      ...data,
      ...(logoKey && { logoKey }),
      ...(documentKey && { documentKey }),
    };

    const res = await SponsorService.update(eventId, sponsorId, payload);
    return res.data;
  } catch {
    return thunkAPI.rejectWithValue('Failed to update sponsor');
  }
});

/* ───────────────────────────────────────────────
   Delete Sponsor
──────────────────────────────────────────────── */
export const deleteSponsor = createAsyncThunk<
  string,
  { eventId: string; sponsorId: string },
  { rejectValue: string }
>('sponsors/delete', async ({ eventId, sponsorId }, thunkAPI) => {
  try {
    await SponsorService.remove(eventId, sponsorId);
    return sponsorId;
  } catch {
    return thunkAPI.rejectWithValue('Failed to delete sponsor');
  }
});

/* ───────────────────────────────────────────────
   Slice
──────────────────────────────────────────────── */
const sponsorSlice = createSlice({
  name: 'sponsors',
  initialState,
  reducers: {
    /* 
      Accept:
      - true  → add mode
      - Sponsor object → edit mode
    */
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

    // Stores FULL SPONSOR object (UI needs it)
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
        state.items = action.payload;
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
        state.items = state.items.map((i) =>
          i._id === action.payload._id ? action.payload : i
        );
      })

      // DELETE
      .addCase(deleteSponsor.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload);
      });
  },
});

export const {
  openForm,
  closeForm,
  setSponsorEventId,
  setDeleteTarget,
} = sponsorSlice.actions;

export default sponsorSlice.reducer;
