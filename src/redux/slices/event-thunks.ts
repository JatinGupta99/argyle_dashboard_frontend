import type { CreateEventDto, Event, UpdateEventDto } from '@/lib/types/components';
import { EventService } from '@/services/event.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { addEvent, removeEvent, updateEventInState } from './event-slice';

/* ──────────────────────────────
   Fetch All Events
──────────────────────────────── */
export const fetchEvents = createAsyncThunk<Event[], void, { rejectValue: string }>(
  'events/fetch',
  async (_, thunkAPI) => {
    try {
      const res = await EventService.getAll();
      return res.data.results as Event[];
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch events');
    }
  },
);

/* ──────────────────────────────
   Fetch Single Event by ID
──────────────────────────────── */
export const fetchEventById = createAsyncThunk<Event, string, { rejectValue: string }>(
  'events/fetchById',
  async (eventId, thunkAPI) => {
    try {
      const res = await EventService.getById(eventId);
      return res.data as Event;
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch event');
    }
  },
);

/* ──────────────────────────────
   Create Event
──────────────────────────────── */
export const createEvent = createAsyncThunk<
  Event,
  { payload: CreateEventDto; imageFile?: File | null },
  { rejectValue: string }
>('events/create', async ({ payload, imageFile }, thunkAPI) => {
  try {
    const res = await EventService.create(payload);
    let event = res.data as Event;

    if (imageFile) {
      const uploadRes = await EventService.getUploadUrl({
        eventId: event._id,
        contentType: imageFile.type,
        type: 'logo',
      });

      await fetch(uploadRes.data.url, { method: 'PUT', body: imageFile });

      event.eventLogoUrl = uploadRes.data.url;
      await EventService.update(event._id, { eventLogoUrl: uploadRes.data.url });
    }

    // Update Redux state immediately
    thunkAPI.dispatch(addEvent(event));

    return event;
  } catch {
    return thunkAPI.rejectWithValue('Failed to create event');
  }
});

/* ──────────────────────────────
   Update Event
──────────────────────────────── */
export const updateEvent = createAsyncThunk<
  Event,
  { id: string; payload: UpdateEventDto; imageFile?: File | null },
  { rejectValue: string }
>('events/update', async ({ id, payload, imageFile }, thunkAPI) => {
  try {
    if (imageFile) {
      const uploadRes = await EventService.getUploadUrl({
        eventId: id,
        contentType: imageFile.type,
        type: 'logo',
      });

      await fetch(uploadRes.data.url, { method: 'PUT', body: imageFile });
      payload.eventLogoUrl = uploadRes.data.url;
    }

    const res = await EventService.update(id, payload);
    const updatedEvent = res.data as Event;

    // Update Redux state immediately
    thunkAPI.dispatch(updateEventInState(updatedEvent));

    return updatedEvent;
  } catch {
    return thunkAPI.rejectWithValue('Failed to update event');
  }
});

/* ──────────────────────────────
   Delete Event
──────────────────────────────── */
export const deleteEvent = createAsyncThunk<string, string, { rejectValue: string }>(
  'events/delete',
  async (id, thunkAPI) => {
    try {
      await EventService.remove(id);

      // Remove from Redux state immediately
      thunkAPI.dispatch(removeEvent(id));

      return id;
    } catch {
      return thunkAPI.rejectWithValue('Failed to delete event');
    }
  },
);
