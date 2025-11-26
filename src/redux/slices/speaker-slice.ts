import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CreateSpeakerDto, Speaker } from '@/lib/types/speaker';
import { SpeakerService } from '@/services/speaker.service';

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

interface SpeakersState {
  eventId: string | null;
  items: Speaker[];
  loading: boolean;
  error: string | null;
  formOpen: boolean;
  editItem: Speaker | null;
  deleteTarget: Speaker | null;
  pagination: Pagination;
}

const initialState: SpeakersState = {
  eventId: null,
  items: [],
  loading: false,
  error: null,
  formOpen: false,
  editItem: null,
  deleteTarget: null,
  pagination: { page: 1, limit: 10, total: 0 },
};

/* ---------- helper: upload file (if service supports it) ---------- */
async function uploadPhotoIfNeeded(eventId: string, file?: File | null) {
  if (!file) return null;
  if (!('upload' in SpeakerService)) return null;
  const res: any = await (SpeakerService as any).upload(eventId, file);
  // adapt depending on your service's return shape
  return res?.url ?? res?.data?.url ?? null;
}

/* ---------- Thunks (read eventId from slice state) ---------- */
export const fetchSpeakers = createAsyncThunk<
  { data: Speaker[]; total: number; page: number; limit: number },
  { page?: number; limit?: number; search?: string } | undefined,
  { rejectValue: string }
>('speakers/fetch', async (args = {}, thunkAPI) => {
  const { page = 1, limit = 10, search = '' } = args || {};
  const state: any = thunkAPI.getState();
  const eventId: string | null = state.speakers?.eventId ?? null;
  if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

  try {
    const res: any = await (SpeakerService as any).getAll(eventId, { page, limit, search });
    return { data: res.data ?? [], total: res.total ?? 0, page, limit };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.message ?? 'Failed to fetch speakers');
  }
});

export const createSpeaker = createAsyncThunk<
  Speaker,
  { payload: Partial<Speaker>; photoFile?: File | null },
  { rejectValue: string }
>('speakers/create', async ({ payload, photoFile }, thunkAPI) => {
  const state: any = thunkAPI.getState();
  const eventId: string | null = state.speakers?.eventId ?? null;
  if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

  try {
    let pictureUrl = payload.pictureUrl ?? '';
    const uploaded = await uploadPhotoIfNeeded(eventId, photoFile);
    if (uploaded) pictureUrl = uploaded;

    const body = { ...payload, pictureUrl } as CreateSpeakerDto;
    const res: any = await SpeakerService.create(eventId, body);
    return res.data ?? res;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.message ?? 'Failed to create speaker');
  }
});

export const updateSpeaker = createAsyncThunk<
  Speaker,
  { id: string; payload: Partial<Speaker>; photoFile?: File | null },
  { rejectValue: string }
>('speakers/update', async ({ id, payload, photoFile }, thunkAPI) => {
  const state: any = thunkAPI.getState();
  const eventId: string | null = state.speakers?.eventId ?? null;
  if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

  try {
    let pictureUrl = payload.pictureUrl ?? '';
    const uploaded = await uploadPhotoIfNeeded(eventId, photoFile);
    if (uploaded) pictureUrl = uploaded;

    const body = { ...payload, pictureUrl };
    const res: any = await SpeakerService.update(eventId, id, body);
    return res.data ?? res;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.message ?? 'Failed to update speaker');
  }
});

export const deleteSpeaker = createAsyncThunk<string, { id: string }, { rejectValue: string }>(
  'speakers/delete',
  async ({ id }, thunkAPI) => {
    const state: any = thunkAPI.getState();
    const eventId: string | null = state.speakers?.eventId ?? null;
    if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

    try {
      await SpeakerService.remove(eventId, id);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.message ?? 'Failed to delete speaker');
    }
  },
);

/* ---------- Slice ---------- */
const speakersSlice = createSlice({
  name: 'speakers',
  initialState,
  reducers: {
    setEventId(state, action: PayloadAction<string>) {
      state.eventId = action.payload;
    },
    openForm(state, action: PayloadAction<Speaker | null>) {
      state.formOpen = true;
      state.editItem = action.payload ?? null;
    },
    closeForm(state) {
      state.formOpen = false;
      state.editItem = null;
    },
    setDeleteTarget(state, action: PayloadAction<Speaker | null>) {
      state.deleteTarget = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.pagination.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.pagination.limit = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* fetch */
      .addCase(fetchSpeakers.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchSpeakers.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.data;
        s.pagination.page = a.payload.page;
        s.pagination.limit = a.payload.limit;
        s.pagination.total = a.payload.total;
      })
      .addCase(fetchSpeakers.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? a.error?.message ?? 'Failed to fetch speakers';
      })

      /* create */
      .addCase(createSpeaker.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(createSpeaker.fulfilled, (s, a) => {
        s.loading = false;
        s.items.unshift(a.payload);
        s.formOpen = false;
        s.editItem = null;
      })
      .addCase(createSpeaker.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? 'Failed to create speaker';
      })

      /* update */
      .addCase(updateSpeaker.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(updateSpeaker.fulfilled, (s, a) => {
        s.loading = false;
        s.items = s.items.map((it) => (it._id === a.payload._id ? a.payload : it));
        s.formOpen = false;
        s.editItem = null;
      })
      .addCase(updateSpeaker.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? 'Failed to update speaker';
      })

      /* delete */
      .addCase(deleteSpeaker.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(deleteSpeaker.fulfilled, (s, a) => {
        s.loading = false;
        s.items = s.items.filter((it) => it._id !== a.payload);
        s.deleteTarget = null;
      })
      .addCase(deleteSpeaker.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? 'Failed to delete speaker';
      });
  },
});

export const { setEventId, openForm, closeForm, setDeleteTarget, setPage, setLimit, clearError } =
  speakersSlice.actions;

export default speakersSlice.reducer;
