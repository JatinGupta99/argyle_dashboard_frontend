import { Agenda, CreateAgendaDto } from '@/lib/types/agenda';
import { AgendaService } from '@/services/agenda.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

/* FETCH AGENDAS (paginated) */
export const fetchAgendas = createAsyncThunk<
  { data: Agenda[]; total: number; page: number; limit: number; totalPages: number },
  { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' } | undefined,
  { rejectValue: string; state: RootState }
>(
  'agendas/fetch',
  async (args = {}, thunkAPI) => {
    const { page = 1, limit = 10, search = '', sortBy, sortOrder } = args || {};
    const state = thunkAPI.getState();
    const eventId = state.agendas.eventId;

    if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

    try {
      return await AgendaService.getAll(eventId, { page, limit, search, sortBy, sortOrder });
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.message ?? 'Failed to fetch agendas');
    }
  }
);

/* FETCH AGENDA BY ID */
export const fetchAgendaById = createAsyncThunk<
  Agenda,
  string, // agendaId
  { rejectValue: string; state: RootState }
>(
  'agendas/fetchById',
  async (agendaId, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const eventId = state.agendas.eventId;

    if (!eventId || !agendaId) return thunkAPI.rejectWithValue('Missing eventId or agendaId');

    try {
      const res = await AgendaService.getById(eventId, agendaId);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.message ?? 'Failed to fetch agenda');
    }
  }
);

/* ADD AGENDA */
export const addAgenda = createAsyncThunk<
  Agenda,
  CreateAgendaDto,
  { rejectValue: string; state: RootState }
>(
  'agendas/add',
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const eventId = state.agendas.eventId;

    if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');

    try {
      const res = await AgendaService.create(eventId, payload);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.message ?? 'Failed to add agenda');
    }
  }
);

/* UPDATE AGENDA */
export const updateAgenda = createAsyncThunk<
  Agenda,
  { agendaId: string; payload: CreateAgendaDto },
  { rejectValue: string; state: RootState }
>(
  'agendas/update',
  async ({ agendaId, payload }, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const eventId = state.agendas.eventId;

    if (!eventId || !agendaId) return thunkAPI.rejectWithValue('Missing eventId or agendaId');

    try {
      const res = await AgendaService.update(eventId, agendaId, payload);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.message ?? 'Failed to update agenda');
    }
  }
);

/* DELETE AGENDA */
export const deleteAgenda = createAsyncThunk<
  string,
  string, // just agendaId
  { rejectValue: string; state: RootState }
>(
  'agendas/delete',
  async (agendaId, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const eventId = state.agendas.eventId;

    if (!eventId) return thunkAPI.rejectWithValue('Missing eventId');
    if (!agendaId) return thunkAPI.rejectWithValue('Missing agendaId');

    try {
      await AgendaService.remove(eventId, agendaId);
      return agendaId;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.message ?? 'Failed to delete agenda');
    }
  }
);
