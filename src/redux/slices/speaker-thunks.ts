import type { CreateSpeakerDto, UpdateSpeakerDto } from '@/lib/types/speaker';
import { PresignedUrlResponse, SpeakerService } from '@/services/speaker.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Speaker } from '@/lib/types/schedule';

/* --------------------------------------------------------
   FETCH ALL SPEAKERS
-------------------------------------------------------- */
export const fetchSpeakers = createAsyncThunk<
  { data: Speaker[]; total: number; page: number; limit: number; totalPages: number },
  | { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }
  | undefined,
  { rejectValue: string; state: RootState }
>('speakers/fetch', async (args = {}, thunkAPI) => {
  const { page = 1, limit = 10, search = '', sortBy, sortOrder } = args || {};
  const state = thunkAPI.getState();
  const eventId = state.speakers.eventId;

  if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

  try {
    return await SpeakerService.getAll(eventId, { page, limit, search, sortBy, sortOrder });
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.message ?? 'Failed to fetch speakers');
  }
});

/* --------------------------------------------------------
   CREATE SPEAKER (with optional image upload)
-------------------------------------------------------- */
export const createSpeaker = createAsyncThunk<
  Speaker,
  { data: CreateSpeakerDto; photoFile?: File | null },
  { rejectValue: string; state: RootState }
>('speakers/create', async ({ data, photoFile }, thunkAPI) => {
  const state = thunkAPI.getState();
  const eventId = state.speakers.eventId;

  if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

  try {
    // 1) Create speaker
    const created = await SpeakerService.create(eventId, data);
    const speaker = created.data as Speaker;
    const speakerId = speaker._id;

    // 2) Upload photo if provided
    if (photoFile) {
      const presign = await SpeakerService.getUploadUrl({
        eventId,
        speakerId,
        contentType: photoFile.type,
        type: 'photo',
      });

      await fetch(presign.data.url, { method: 'PUT', body: photoFile });

      await SpeakerService.update(eventId, speakerId, { ...data, pictureUrl: presign.data.key });
    }

    return speaker;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.message ?? 'Failed to create speaker');
  }
});

/* --------------------------------------------------------
   UPDATE SPEAKER (with optional image upload)
-------------------------------------------------------- */
export const updateSpeaker = createAsyncThunk<
  Speaker,
  { id: string; payload: UpdateSpeakerDto; photoFile?: File | null },
  { rejectValue: string; state: RootState }
>('speakers/update', async ({ id, payload, photoFile }, thunkAPI) => {
  const state = thunkAPI.getState();
  const eventId = state.speakers.eventId;

  if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

  try {
    let pictureKey: string | undefined;

    if (photoFile) {
      const presign = await SpeakerService.getUploadUrl({
        eventId,
        speakerId: id,
        contentType: photoFile.type,
        type: 'logo',
      });

      await fetch(presign.data.url, { method: 'PUT', body: photoFile });
      pictureKey = presign.data.key;
    }

    const updated = await SpeakerService.update(eventId, id, {
      ...payload,
      ...(pictureKey ? { pictureUrl: pictureKey } : {}),
    });
    return updated.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.message ?? 'Failed to update speaker');
  }
});

/* --------------------------------------------------------
   DELETE SPEAKER
-------------------------------------------------------- */
export const deleteSpeaker = createAsyncThunk<
  string,
  string,
  { rejectValue: string; state: RootState }
>('speakers/delete', async (id, thunkAPI) => {
  const state = thunkAPI.getState();
  const eventId = state.speakers.eventId;

  if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

  try {
    await SpeakerService.remove(eventId, id);
    return id;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.message ?? 'Failed to delete speaker');
  }
});

/* --------------------------------------------------------
   OPTIONAL: DIRECT IMAGE UPLOAD
-------------------------------------------------------- */
export const uploadSpeakerImage = createAsyncThunk<
  string,
  { file: File; speakerId: string },
  { rejectValue: string; state: RootState }
>('speakers/uploadImage', async ({ file, speakerId }, thunkAPI) => {
  const state = thunkAPI.getState();
  const eventId = state.speakers.eventId;

  if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

  try {
    const presign: PresignedUrlResponse = await SpeakerService.getUploadUrl({
      eventId,
      speakerId,
      contentType: file.type,
      type: 'logo',
    });

    await fetch(presign.data.url, { method: 'PUT', body: file });
    return presign.data.key;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.message ?? 'Failed to upload image');
  }
});
