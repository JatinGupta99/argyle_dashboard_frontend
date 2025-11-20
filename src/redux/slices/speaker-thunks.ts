import { createAsyncThunk } from '@reduxjs/toolkit';
import { SpeakerService, PresignedUrlResponse } from '@/services/speaker.service';
import type { CreateSpeakerDto, Speaker, UpdateSpeakerDto } from '@/lib/types/speaker';

/* --------------------------------------------------------
   FETCH ALL SPEAKERS
-------------------------------------------------------- */
export const fetchSpeakers = createAsyncThunk(
  'speakers/fetchAll',
  async (
    { eventId, page = 1, limit = 10, search = '' }:
    { eventId: string; page?: number; limit?: number; search?: string },
    thunkAPI
  ) => {
    try {
      const result = await SpeakerService.getAll(eventId);
      return { ...result, eventId };
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch speakers');
    }
  }
);

/* --------------------------------------------------------
   CREATE SPEAKER (with optional image upload)
-------------------------------------------------------- */
export const createSpeaker = createAsyncThunk(
  'speakers/create',
  async (
    {
      eventId,
      data,
      photoFile,
    }: {
      eventId: string;
      data: CreateSpeakerDto;
      photoFile?: File | null;
    },
    thunkAPI
  ) => {
    try {
      // 1) Create speaker WITHOUT image
      const created = await SpeakerService.create(eventId, data);
      const speaker = created.data as Speaker;
      const speakerId = speaker._id;

      let pictureKey: string | null = null;

      // 2) Upload photo (if provided)
      if (photoFile) {
        const presign = await SpeakerService.getUploadUrl({
          eventId,
          speakerId: speakerId, // or speakerId if API expects speakerId
          contentType: photoFile.type,
          type: 'photo', // <-- FIXED
        });

        // Upload file to presigned URL
        await fetch(presign.data.url, {
          method: 'PUT',
          body: photoFile,
        });

        pictureKey = presign.data.key; // <-- FIXED
      }

      // 3) Update speaker with uploaded key
      if (pictureKey) {
        await SpeakerService.update(eventId, speakerId, {
          ...data,
          pictureUrl:pictureKey,
        });
      }

      return speaker;
    } catch (e) {
      return thunkAPI.rejectWithValue('Failed to create speaker');
    }
  }
);


/* --------------------------------------------------------
   UPDATE SPEAKER (with optional image upload)
-------------------------------------------------------- */
export const updateSpeaker = createAsyncThunk(
  'speakers/update',
  async (
    {
      eventId,
      id,
      payload,
      photoFile,
    }: {
      eventId: string;
      id: string;
      payload: UpdateSpeakerDto;
      photoFile?: File | null;
    },
    thunkAPI
  ) => {
    try {
      let pictureKey: string | undefined = undefined;

      // 1) If a new photo is uploaded
      if (photoFile) {
        const presign = await SpeakerService.getUploadUrl({
          eventId,
          speakerId: id,
          contentType: photoFile.type,
          type: 'logo',
        });

        await fetch(presign.data.url, {
          method: 'PUT',
          body: photoFile,
        });

        pictureKey = presign.data.key;
      }

      // 2) Update speaker info (+ pictureKey if provided)
      const updated = await SpeakerService.update(eventId, id, {
        ...payload,
        ...(pictureKey ? { pictureKey } : {}),
      });

      return updated.data;
    } catch {
      return thunkAPI.rejectWithValue('Failed to update speaker');
    }
  }
);

/* --------------------------------------------------------
   DELETE SPEAKER
-------------------------------------------------------- */
export const deleteSpeaker = createAsyncThunk(
  'speakers/delete',
  async ({ eventId, id }: { eventId: string; id: string }, thunkAPI) => {
    try {
      await SpeakerService.remove(eventId, id);
      return { id };
    } catch {
      return thunkAPI.rejectWithValue('Failed to delete speaker');
    }
  }
);

/* --------------------------------------------------------
   OPTIONAL: DIRECT IMAGE UPLOAD HELP THUNK
   (Kept only if UI wants to upload before saving)
-------------------------------------------------------- */
export const uploadSpeakerImage = createAsyncThunk(
  'speakers/uploadImage',
  async (
    { file, eventId, speakerId }: { file: File; eventId: string; speakerId: string },
    thunkAPI
  ) => {
    try {
      const presign: PresignedUrlResponse = await SpeakerService.getUploadUrl({
        eventId,
        speakerId,
        contentType: file.type,
        type: 'logo',
      });

      await fetch(presign.data.url, {
        method: 'PUT',
        body: file,
      });

      return presign.data.key;
    } catch {
      return thunkAPI.rejectWithValue('Failed to upload image');
    }
  }
);
