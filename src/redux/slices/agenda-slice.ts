import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchAgendas,
  addAgenda,
  updateAgenda,
  removeAgenda,
  fetchAgendaById,
} from './agenda-thunks';

import type { Agenda } from '@/lib/types/agenda';

interface AgendaState {
  items: Agenda[];
  loading: boolean;
  error: string | null;

  formOpen: boolean;
  editing: Agenda | null;

  deleteTarget: Agenda | null;

  eventId: string | null;
  agendaId: string | null; // 👈 NEW: Track currently selected agenda
}

const initialState: AgendaState = {
  items: [],
  loading: false,
  error: null,

  formOpen: false,
  editing: null,

  deleteTarget: null,

  eventId: null,
  agendaId: null,
};

export const agendaSlice = createSlice({
  name: 'agendas',
  initialState,

  reducers: {
    openAgendaForm(state, action: PayloadAction<Agenda | null>) {
      state.formOpen = true;
      state.editing = action.payload ?? null;
      state.agendaId = action.payload?._id ?? null;  // 👈 store agendaId too
    },

    closeAgendaForm(state) {
      state.formOpen = false;
      state.editing = null;
      state.agendaId = null;
    },

    setAgendaEventId(state, action: PayloadAction<string>) {
      state.eventId = action.payload;
    },

    setAgendaId(state, action: PayloadAction<string | null>) {
      state.agendaId = action.payload; // 👈 NEW
    },

    clearAgendaError(state) {
      state.error = null;
    },

    setAgendaDeleteTarget(state, action: PayloadAction<Agenda | null>) {
      state.deleteTarget = action.payload;
    },

    clearAgendaDeleteTarget(state) {
      state.deleteTarget = null;
    },
  },

  extraReducers: (builder) => {
    /* ---------- FETCH ONE ---------- */
    builder.addCase(fetchAgendaById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchAgendaById.fulfilled, (state, action) => {
      state.loading = false;
      state.editing = action.payload;
    });

    builder.addCase(fetchAgendaById.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Failed to load agenda';
    });

    /* ---------- FETCH ALL ---------- */
    builder.addCase(fetchAgendas.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchAgendas.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload ?? [];
    });

    builder.addCase(fetchAgendas.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Failed to load agendas';
    });

    /* ---------- ADD ---------- */
    builder.addCase(addAgenda.fulfilled, (state, action) => {
      state.items.push(action.payload);
      state.formOpen = false;
      state.editing = null;
      state.agendaId = null;
    });

    /* ---------- UPDATE ---------- */
    builder.addCase(updateAgenda.fulfilled, (state, action) => {
      const updated = action.payload;
      state.items = state.items.map((a) =>
        a._id === updated._id ? updated : a
      );
      state.formOpen = false;
      state.editing = null;
      state.agendaId = null;
    });

    /* ---------- DELETE ---------- */
    builder.addCase(removeAgenda.fulfilled, (state, action) => {
      state.items = state.items.filter((a) => a._id !== action.payload);
      state.deleteTarget = null;

      if (state.agendaId === action.payload) {
        state.agendaId = null;
        state.editing = null;
      }
    });
  },
});

export const {
  openAgendaForm,
  closeAgendaForm,
  setAgendaEventId,
  setAgendaId,          // 👈 Export new action
  clearAgendaError,
  setAgendaDeleteTarget,
  clearAgendaDeleteTarget,
} = agendaSlice.actions;

export default agendaSlice.reducer;
