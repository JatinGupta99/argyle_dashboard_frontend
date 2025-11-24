import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '@/redux/slices/event-thunks';
import type { Event } from '@/lib/types/components';

export interface CreateEventForm {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  eventLogoUrl?: string;
}
export interface UpdateEventForm {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  imageUrl?: string;
  _id: string;
}

interface EventState {
  items: Event[];
  loading: boolean;
  error: string | null;
  formOpen: boolean;
  editing: UpdateEventForm | null;
  deleteTarget: Event | null;
}

const initialState: EventState = {
  items: [],
  loading: false,
  error: null,
  formOpen: false,
  editing: null,
  deleteTarget: null,
};

export const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    openEventForm(state, action: PayloadAction<UpdateEventForm | null>) {
      state.formOpen = true;
      state.editing = action.payload ?? null;
    },
    closeEventForm(state) {
      state.formOpen = false;
      state.editing = null;
    },
    setEventDeleteTarget(state, action: PayloadAction<Event | null>) {
      state.deleteTarget = action.payload;
    },
    clearEventDeleteTarget(state) {
      state.deleteTarget = null;
    },
    clearEventError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // FETCH
    builder.addCase(fetchEvents.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload ?? [];
    });
    builder.addCase(fetchEvents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to load events';
    });

    // CREATE
    builder.addCase(createEvent.fulfilled, (state, action) => {
      state.items.push(action.payload);
      state.formOpen = false;
      state.editing = null;
    });

    // UPDATE
    builder.addCase(updateEvent.fulfilled, (state, action) => {
      const updated = action.payload;
      state.items = state.items.map((e) => (e._id === updated._id ? updated : e));
      state.formOpen = false;
      state.editing = null;
    });

    // DELETE
    builder.addCase(deleteEvent.fulfilled, (state, action) => {
      state.items = state.items.filter((e) => e._id !== action.payload);
      state.deleteTarget = null;

      if (state.editing?._id === action.payload) {
        state.editing = null;
        state.formOpen = false;
      }
    });
  },
});

export const {
  openEventForm,
  closeEventForm,
  setEventDeleteTarget,
  clearEventDeleteTarget,
  clearEventError,
} = eventSlice.actions;

export default eventSlice.reducer;
