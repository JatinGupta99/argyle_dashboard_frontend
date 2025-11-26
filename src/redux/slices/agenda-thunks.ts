// src/redux/slices/agenda-thunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { CreateAgendaDto } from '@/lib/types/agenda';
import { AgendaService } from '@/services/agenda.service';

export const fetchAgendas = createAsyncThunk('agendas/fetch', async (_, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  const eventId = state.agendas.eventId;

  if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

  try {
    const res = await AgendaService.getAll(eventId);
    return res.data;
  } catch {
    return thunkAPI.rejectWithValue('Failed to load agendas');
  }
});
export const fetchAgendaById = createAsyncThunk(
  'agendas/fetchById',
  async ({ agendaId }: { agendaId: string }, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const eventId = state.agendas.eventId;

    if (!eventId || !agendaId) return thunkAPI.rejectWithValue('Missing eventId or agendaId');

    try {
      const res = await AgendaService.getById(eventId, agendaId);
      return res.data;
    } catch {
      return thunkAPI.rejectWithValue('Failed to load agenda');
    }
  },
);

export const addAgenda = createAsyncThunk(
  'agendas/add',
  async (payload: { payload: CreateAgendaDto }, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const eventId = state.agendas.eventId;

    if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

    try {
      const res = await AgendaService.create(eventId, payload.payload);
      return res.data;
    } catch {
      return thunkAPI.rejectWithValue('Failed to add agenda');
    }
  },
);

export const updateAgenda = createAsyncThunk(
  'agendas/update',
  async (data: { agendaId: string; payload: CreateAgendaDto }, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const eventId = state.agendas.eventId;

    if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

    try {
      const res = await AgendaService.update(eventId, data.agendaId, data.payload);
      return res.data;
    } catch {
      return thunkAPI.rejectWithValue('Failed to update agenda');
    }
  },
);

export const removeAgenda = createAsyncThunk(
  'agendas/delete',
  async (agendaId: string, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const eventId = state.agendas.eventId;

    if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

    await AgendaService.remove(eventId, agendaId);
    return agendaId;
  },
);
