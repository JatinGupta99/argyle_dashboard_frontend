import { createSlice } from '@reduxjs/toolkit';
import { fetchSpeakers, createSpeaker, updateSpeaker, deleteSpeaker } from './speaker-thunks';

import type { Speaker } from '@/lib/types/speaker';

interface State {
  list: Speaker[];
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  list: [],
  loading: false,
  error: null,
};

const speakerSlice = createSlice({
  name: 'speakers',
  initialState,
  reducers: {
    clearSpeakerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpeakers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(createSpeaker.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(updateSpeaker.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((s) => (s._id === action.payload._id ? action.payload : s));
      })
      .addCase(deleteSpeaker.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((s) => s._id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = (action.payload as string) || 'An unknown error occurred.';
        }
      );
  },
});

export const { clearSpeakerError } = speakerSlice.actions;

export default speakerSlice.reducer;
