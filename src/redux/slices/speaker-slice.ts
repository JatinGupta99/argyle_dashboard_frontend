import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Speaker } from '@/lib/types/speaker';
import {
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
  fetchSpeakers,
} from './speaker-thunks';

interface SpeakerState {
  items: Speaker[];
  loading: boolean;
  error: string | null;
  formOpen: boolean;
  editing: Speaker | null;
  deleteTarget: Speaker | null;
  eventId: string | null;

  query: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };

  meta: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

const initialState: SpeakerState = {
  items: [],
  loading: false,
  error: null,
  formOpen: false,
  editing: null,
  deleteTarget: null,
  eventId: null,
  query: { page: 1, limit: 10, search: '', sortBy: 'name', sortOrder: 'asc' },
  meta: { total: 0, totalPages: 1, page: 1, limit: 10 },
};

export const speakerSlice = createSlice({
  name: 'speakers',
  initialState,

  reducers: {
    openSpeakerForm(state, action: PayloadAction<true | Speaker>) {
      state.formOpen = true;
      state.editing = action.payload === true ? null : action.payload;
    },

    closeSpeakerForm(state) {
      state.formOpen = false;
      state.editing = null;
    },

    setSpeakerEventId(state, action: PayloadAction<string>) {
      state.eventId = action.payload;
    },

    setSpeakerDeleteTarget(state, action: PayloadAction<Speaker | null>) {
      state.deleteTarget = action.payload;
    },

    clearSpeakerDeleteTarget(state) {
      state.deleteTarget = null;
    },

    setSpeakerQuery(state, action: PayloadAction<Partial<SpeakerState['query']>>) {
      state.query = { ...state.query, ...action.payload };
    },

    clearSpeakerError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // FETCH
    builder.addCase(fetchSpeakers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSpeakers.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.data ?? [];
      state.meta = {
        total: action.payload.total ?? 0,
        totalPages: action.payload.totalPages ?? 1,
        page: action.payload.page ?? state.query.page,
        limit: action.payload.limit ?? state.query.limit,
      };
    });
    builder.addCase(fetchSpeakers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to fetch speakers';
    });

    // CREATE
    builder.addCase(createSpeaker.fulfilled, (state, action) => {
      state.items.push(action.payload);
      state.formOpen = false;
      state.editing = null;
    });

    // UPDATE
    builder.addCase(updateSpeaker.fulfilled, (state, action) => {
      state.items = state.items.map((s) =>
        s._id === action.payload._id ? action.payload : s
      );
      state.formOpen = false;
      state.editing = null;
    });

    // DELETE
    builder.addCase(deleteSpeaker.fulfilled, (state, action) => {
      state.items = state.items.filter((s) => s._id !== action.payload); // payload is just _id string
      state.deleteTarget = null;
      if (state.editing?._id === action.payload) {
        state.editing = null;
      }
    });
  },
});

export const {
  openSpeakerForm,
  closeSpeakerForm,
  setSpeakerEventId,
  setSpeakerDeleteTarget,
  clearSpeakerDeleteTarget,
  setSpeakerQuery,
  clearSpeakerError,
} = speakerSlice.actions;

export default speakerSlice.reducer;
