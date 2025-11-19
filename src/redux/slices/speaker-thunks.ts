import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  SpeakerService,
  PresignedUrlResponse,
} from '@/services/speaker.service';
import type { Speaker, CreateSpeakerDto, UpdateSpeakerDto } from '@/lib/types/speaker';
import { HTTP_METHODS } from 'next/dist/server/web/http';

interface ThunkApiConfig {
  rejectValue: string;
}

export const fetchSpeakers = createAsyncThunk<
  Speaker[],
  string,
  ThunkApiConfig
>(
  'speakers/fetchAll',
  async (eventId, thunkAPI) => {
    try {
      const result = await SpeakerService.getAll(eventId);
      return result.data as Speaker[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to fetch speakers');
    }
  }
);

export const createSpeaker = createAsyncThunk<
  Speaker,
  { eventId: string; payload: CreateSpeakerDto },
  ThunkApiConfig
>(
  'speakers/create',
  async ({ eventId, payload }, thunkAPI) => {
    try {
      const result = await SpeakerService.create(eventId, payload);
      return result.data as Speaker;
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to create speaker');
    }
  }
);

export const updateSpeaker = createAsyncThunk<
  Speaker,
  { eventId: string; id: string; payload: UpdateSpeakerDto },
  ThunkApiConfig
>(
  'speakers/update',
  async ({ eventId, id, payload }, thunkAPI) => {
    try {
      const result = await SpeakerService.update(eventId, id, payload);
      return result.data as Speaker;
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to update speaker');
    }
  }
);

export const deleteSpeaker = createAsyncThunk<
  string,
  { eventId: string; id: string },
  ThunkApiConfig
>(
  'speakers/delete',
  async ({ eventId, id }, thunkAPI) => {
    try {
      await SpeakerService.remove(eventId, id);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to delete speaker');
    }
  }
);

export const uploadSpeakerImage = createAsyncThunk<
  string,
  { file: File; eventId: string; speakerId: string },
  ThunkApiConfig
>(
  'speakers/uploadImage',
  async ({ file, eventId, speakerId }, thunkAPI) => {
    try {
      const presign: PresignedUrlResponse = await SpeakerService.getUploadUrl({
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