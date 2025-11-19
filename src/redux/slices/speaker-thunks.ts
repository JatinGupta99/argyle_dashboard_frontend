import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  SpeakerService,
  PresignedUrlResponse,
} from '@/services/speaker.service';
import type { CreateSpeakerDto, UpdateSpeakerDto } from '@/lib/types/speaker';
import { HTTP_METHODS } from 'next/dist/server/web/http';

/* ───────────────────────────────────────────────
   Fetch All Speakers (requires eventId)
─────────────────────────────────────────────── */
export const fetchSpeakers = createAsyncThunk(
  'speakers/fetchAll',
  async (eventId: string, thunkAPI) => {
    try {
      const result= await SpeakerService.getAll(eventId);
      return result.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to fetch speakers');
    }
  }
);

/* ───────────────────────────────────────────────
   Create Speaker
─────────────────────────────────────────────── */
export const createSpeaker = createAsyncThunk(
  'speakers/create',
  async (
    { eventId, payload }: { eventId: string; payload: CreateSpeakerDto },
    thunkAPI
  ) => {
    try {
      const result= await SpeakerService.create(eventId, payload);
      return result.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to create speaker');
    }
  }
);

/* ───────────────────────────────────────────────
   Update Speaker
─────────────────────────────────────────────── */
export const updateSpeaker = createAsyncThunk(
  'speakers/update',
  async (
    {
      eventId,
      id,
      payload,
    }: { eventId: string; id: string; payload: UpdateSpeakerDto },
    thunkAPI
  ) => {
    try {
      const result= await SpeakerService.update(eventId, id, payload);
      return result.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to update speaker');
    }
  }
);

/* ───────────────────────────────────────────────
   Delete Speaker
─────────────────────────────────────────────── */
export const deleteSpeaker = createAsyncThunk(
  'speakers/delete',
  async ({ eventId, id }: { eventId: string; id: string }, thunkAPI) => {
    try {
      await SpeakerService.remove(eventId, id);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to delete speaker');
    }
  }
);

/* ───────────────────────────────────────────────
   Upload Speaker Image (Presigned URL)
─────────────────────────────────────────────── */
export const uploadSpeakerImage = createAsyncThunk(
  'speakers/uploadImage',
  async (
    {
      file,
      eventId,
      speakerId,
    }: { file: File; eventId: string; speakerId: string },
    thunkAPI
  ) => {
    try {
      const presign: PresignedUrlResponse =
      await SpeakerService.getUploadUrl({
          eventId,
          speakerId,
          contentType: file.type,
      });

      await fetch(presign.data.url, {
        method: HTTP_METHODS[4],
        body: file,
      });

      return presign.data.url;
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to upload image');
    }
  }
);
