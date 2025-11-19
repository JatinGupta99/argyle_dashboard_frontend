import { createAsyncThunk } from '@reduxjs/toolkit';
import { AgendaService } from '@/services/agenda.service';
import type { CreateAgendaDto, UpdateAgendaDto } from '@/lib/types/agenda';

/* ───────────────────────────────────────────────
   Fetch All Agendas for Event
─────────────────────────────────────────────── */
export const fetchAgendas = createAsyncThunk(
  'agendas/fetchAll',
  async (eventId: string, thunkAPI) => {
    try {
      const result = await AgendaService.getAll(eventId);
      return result.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to fetch agendas');
    }
  }
);

/* ───────────────────────────────────────────────
   Add Agenda
─────────────────────────────────────────────── */
export const addAgenda = createAsyncThunk(
  'agendas/create',
  async ({ eventId, payload }: { eventId: string; payload: CreateAgendaDto }, thunkAPI) => {
    try {
      const result = await AgendaService.create(eventId, payload);
      return result.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to create agenda');
    }
  }
);

/* ───────────────────────────────────────────────
   Update Agenda
─────────────────────────────────────────────── */
export const updateAgenda = createAsyncThunk(
  'agendas/update',
  async (
    { eventId, agendaId, payload }: { eventId: string; agendaId: string; payload: UpdateAgendaDto },
    thunkAPI
  ) => {
    try {
      const result = await AgendaService.update(eventId, agendaId, payload);
      return result.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to update agenda');
    }
  }
);

/* ───────────────────────────────────────────────
   Delete Agenda
─────────────────────────────────────────────── */
export const removeAgenda = createAsyncThunk(
  'agendas/delete',
  async ({ eventId, agendaId }: { eventId: string; agendaId: string }, thunkAPI) => {
    try {
      await AgendaService.remove(eventId, agendaId);
      return agendaId; // used in reducer for filtering
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to delete agenda');
    }
  }
);
