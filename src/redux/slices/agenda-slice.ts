import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Agenda, CreateAgendaDto, UpdateAgendaDto } from '@/lib/types/agenda';
import { AgendaService } from '@/services/agenda.service';

// Define the shape of the state
interface AgendasState {
  list: Agenda[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AgendasState = {
  list: [],
  status: 'idle',
  error: null,
};

// --- Async Thunks ---

/**
 * Fetches all agendas for a specific event.
 * Requires the eventId to be passed when dispatching this thunk.
 */
export const fetchAgendas = createAsyncThunk(
  'agendas/fetchAgendas',
  async (eventId: string, { rejectWithValue }) => {
    try {
      // Use the AgendaService.getAll method
      const response = await AgendaService.getAll(eventId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch agendas');
    }
  }
);

/**
 * Adds a new agenda.
 * Payload should include eventId and the agenda data.
 */
export const addAgenda = createAsyncThunk(
  'agendas/addAgenda',
  async (
    { eventId, payload }: { eventId: string; payload: CreateAgendaDto },
    { rejectWithValue }
  ) => {
    try {
      // Use the AgendaService.create method
      const response = await AgendaService.create(eventId, payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add agenda');
    }
  }
);

/**
 * Updates an existing agenda.
 * Payload should include eventId, agendaId, and the update data.
 */
export const updateAgenda = createAsyncThunk(
  'agendas/updateAgenda',
  async (
    { eventId, agendaId, payload }: { eventId: string; agendaId: string; payload: UpdateAgendaDto },
    { rejectWithValue }
  ) => {
    try {
      // Use the AgendaService.update method
      const response = await AgendaService.update(eventId, agendaId, payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update agenda');
    }
  }
);

/**
 * Removes an agenda by its ID.
 * Payload should include eventId and agendaId.
 */
export const removeAgenda = createAsyncThunk(
  'agendas/removeAgenda',
  async ({ eventId, agendaId }: { eventId: string; agendaId: string }, { rejectWithValue }) => {
    try {
      // Use the AgendaService.remove method
      await AgendaService.remove(eventId, agendaId);
      return agendaId; // Return the ID of the removed item to update the state
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove agenda');
    }
  }
);

// --- Slice Definition ---

const agendasSlice = createSlice({
  name: 'agendas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Agendas
      .addCase(fetchAgendas.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAgendas.fulfilled, (state, action: PayloadAction<Agenda[]>) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchAgendas.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Unknown error';
      })
      // Add Agenda
      .addCase(addAgenda.fulfilled, (state, action: PayloadAction<Agenda>) => {
        state.list.push(action.payload);
      })
      // Update Agenda
      .addCase(updateAgenda.fulfilled, (state, action: PayloadAction<Agenda>) => {
        const index = state.list.findIndex((agenda) => agenda._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      // Remove Agenda
      .addCase(removeAgenda.fulfilled, (state, action: PayloadAction<string>) => {
        // Filter out the deleted agenda using the returned ID
        state.list = state.list.filter((agenda) => agenda._id !== action.payload);
      });
  },
});

export default agendasSlice.reducer;
