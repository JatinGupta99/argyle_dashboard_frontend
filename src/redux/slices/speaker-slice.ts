import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PresignedUrlResponse, SpeakerService } from '@/services/speaker.service';
import type { Speaker, CreateSpeakerDto, UpdateSpeakerDto } from '@/lib/types/speaker';

/* ────────────────────────────────────────────────────────────────
   EXISTING THUNKS — unchanged
────────────────────────────────────────────────────────────────── */
export const fetchSpeakers = createAsyncThunk('speakers/fetchAll', async (_, thunkAPI) => {
  try {
    return await SpeakerService.getAll();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch speakers');
  }
});

export const createSpeaker = createAsyncThunk(
  'speakers/create',
  async (payload: CreateSpeakerDto, thunkAPI) => {
    try {
      return await SpeakerService.create(payload);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to create speaker');
    }
  }
);

export const updateSpeaker = createAsyncThunk(
  'speakers/update',
  async ({ id, payload }: { id: string; payload: UpdateSpeakerDto }, thunkAPI) => {
    try {
      return await SpeakerService.update(id, payload);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to update speaker');
    }
  }
);

export const deleteSpeaker = createAsyncThunk('speakers/delete', async (id: string, thunkAPI) => {
  try {
    await SpeakerService.remove(id);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Failed to delete speaker');
  }
});

export const uploadSpeakerImage = createAsyncThunk(
  'speakers/uploadImage',
  async ({ file, eventId }: { file: File; eventId: string }, thunkAPI) => {
    try {
      // 1. Request presigned URL
      const presign: PresignedUrlResponse = await SpeakerService.getUploadUrl({
        eventId,
        entityType: 'speakers',
        entityId: 'temp',
        fileType: file.type,
      });

      // 2. Upload to S3
      await fetch(presign?.data?.url, {
        method: 'PUT',
        body: file,
      });

      return presign.data.url;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to upload image');
    }
  }
);

/* ──────────────────────────────────────────────────────────────── */

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

const speakerSlice = createSlice({
  name: 'speakers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* EXISTING LOGIC — unchanged */
      .addCase(fetchSpeakers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSpeakers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSpeakers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createSpeaker.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteSpeaker.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s._id !== action.payload);
      })
      .addCase(uploadSpeakerImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadSpeakerImage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadSpeakerImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default speakerSlice.reducer;
