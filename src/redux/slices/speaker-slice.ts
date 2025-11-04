import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SpeakerService } from '@/services/speaker.service';
import type { Speaker, CreateSpeakerDto, UpdateSpeakerDto } from '@/lib/types/speaker';

// 🔹 Fetch all speakers
export const fetchSpeakers = createAsyncThunk<Speaker[], void, { rejectValue: string }>(
  'speakers/fetchAll',
  async (_, thunkAPI) => {
    try {
      const data = await SpeakerService.getAll();
      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Failed to fetch speakers';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 🔹 Create speaker
export const createSpeaker = createAsyncThunk<Speaker, CreateSpeakerDto, { rejectValue: string }>(
  'speakers/create',
  async (payload, thunkAPI) => {
    try {
      const data = await SpeakerService.create(payload);
      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Failed to create speaker';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 🔹 Update speaker
export const updateSpeaker = createAsyncThunk<
  Speaker,
  { id: string; payload: UpdateSpeakerDto },
  { rejectValue: string }
>('speakers/update', async ({ id, payload }, thunkAPI) => {
  try {
    const data = await SpeakerService.update(id, payload);
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'Failed to update speaker';
    return thunkAPI.rejectWithValue(message);
  }
});

// 🔹 Delete speaker
export const deleteSpeaker = createAsyncThunk<string, string, { rejectValue: string }>(
  'speakers/delete',
  async (id, thunkAPI) => {
    try {
      await SpeakerService.remove(id);
      return id;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Failed to delete speaker';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 🔹 State
interface SpeakerState {
  list: Speaker[];
  loading: boolean;
  error: string | null;
}

const initialState: SpeakerState = {
  list: [],
  loading: false,
  error: null,
};

// 🔹 Slice
const speakerSlice = createSlice({
  name: 'speakers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchSpeakers.pending, (state) => {
        state.loading = true;
        state.error = null; // ✅ reset error
      })
      .addCase(fetchSpeakers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSpeakers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load speakers';
      })

      // CREATE
      .addCase(createSpeaker.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // UPDATE
      .addCase(updateSpeaker.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (s) => s._id === action.payload._id || s.id === action.payload.id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteSpeaker.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s._id !== action.payload && s.id !== action.payload);
      });
  },
});

export default speakerSlice.reducer;
