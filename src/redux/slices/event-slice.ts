import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from './event-thunks';
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
  _id: string;
  title: string;
  eventDate: string;
  schedule: {
    startTime: string;
    endTime: string;
  };
  description: string;
  eventLogoUrl?: string;
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
    // Synchronous updates for immediate UI change if needed
    addEvent(state, action: PayloadAction<Event>) {
      state.items.push(action.payload);
    },
    updateEventInState(state, action: PayloadAction<Event>) {
      state.items = state.items.map((e) => (e._id === action.payload._id ? action.payload : e));
    },
    removeEvent(state, action: PayloadAction<string>) {
      state.items = state.items.filter((e) => e._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // FETCH EVENTS
    builder.addCase(fetchEvents.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchEvents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to fetch events';
    });

    // CREATE EVENT
    builder.addCase(createEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createEvent.fulfilled, (state, action) => {
      state.loading = false;
      state.items.push(action.payload);
      state.formOpen = false;
      state.editing = null;
    });
    builder.addCase(createEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to create event';
    });

    // UPDATE EVENT
    builder.addCase(updateEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateEvent.fulfilled, (state, action) => {
      state.loading = false;
      const updated = action.payload;
      state.items = state.items.map((e) => (e._id === updated._id ? updated : e));
      state.formOpen = false;
      state.editing = null;
    });
    builder.addCase(updateEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to update event';
    });

    // DELETE EVENT
    builder.addCase(deleteEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteEvent.fulfilled, (state, action) => {
      state.loading = false;
      state.items = state.items.filter((e) => e._id !== action.payload);
      state.deleteTarget = null;
      if (state.editing?._id === action.payload) {
        state.formOpen = false;
        state.editing = null;
      }
    });
    builder.addCase(deleteEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to delete event';
    });
  },
});

export const {
  openEventForm,
  closeEventForm,
  setEventDeleteTarget,
  clearEventDeleteTarget,
  clearEventError,
  addEvent,
  updateEventInState,
  removeEvent,
} = eventSlice.actions;

export default eventSlice.reducer;
