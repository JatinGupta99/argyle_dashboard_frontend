import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addAgenda,
  deleteAgenda,
  fetchAgendaById,
  fetchAgendas,
  updateAgenda,
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
  agendaId: string | null;

  query: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };

  meta: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
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

  query: {
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'title',
    sortOrder: 'asc',
  },

  meta: {
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 10,
  },
};

export const agendaSlice = createSlice({
  name: 'agendas',
  initialState,

  reducers: {
    openAgendaForm(state, action: PayloadAction<Agenda | null>) {
      state.formOpen = true;
      state.editing = action.payload ?? null;
      state.agendaId = action.payload?._id ?? null;
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
      state.agendaId = action.payload;
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

    setAgendaQuery(state, action: PayloadAction<Partial<AgendaState['query']>>) {
      state.query = { ...state.query, ...action.payload };
    },
  },

  extraReducers: (builder) => {
    // Fetch by ID
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
      state.error = action.payload ?? 'Failed to load agenda';
    });

    // Fetch all
    builder.addCase(fetchAgendas.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAgendas.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.data ?? [];
      state.meta = {
        total: action.payload.meta.total ?? 0,
        totalPages: action.payload.meta.totalPages ?? 1,
        page: action.payload.meta.page ?? state.query.page,
        limit: action.payload.meta.limit ?? state.query.limit,
      };
    });
    builder.addCase(fetchAgendas.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to load agendas';
    });

    // Add agenda
    builder.addCase(addAgenda.fulfilled, (state, action) => {
      state.items.push(action.payload);
      state.formOpen = false;
      state.editing = null;
      state.agendaId = null;
    });

    // Update agenda
    builder.addCase(updateAgenda.fulfilled, (state, action) => {
      state.items = state.items.map((a) => (a._id === action.payload._id ? action.payload : a));
      state.formOpen = false;
      state.editing = null;
      state.agendaId = null;
    });

    // Remove agenda
    builder.addCase(deleteAgenda.fulfilled, (state, action) => {
      state.items = state.items.filter((a) => a._id !== action.payload);
      state.deleteTarget = null;
      if (state.agendaId === action.payload) {
        state.agendaId = null;
      }
    });
  },
});

export const {
  openAgendaForm,
  closeAgendaForm,
  setAgendaEventId,
  setAgendaId,
  clearAgendaError,
  setAgendaDeleteTarget,
  clearAgendaDeleteTarget,
  setAgendaQuery,
} = agendaSlice.actions;

export default agendaSlice.reducer;
