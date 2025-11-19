import { createSlice } from '@reduxjs/toolkit';
import { fetchAgendas, addAgenda, updateAgenda, removeAgenda } from './agenda-thunks';

import type { Agenda } from '@/lib/types/agenda';

interface State {
  list: Agenda[];
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  list: [],
  loading: false,
  error: null,
};

const agendaSlice = createSlice({
  name: 'agendas',
  initialState,
  reducers: {
    clearAgendaError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgendas.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload as Agenda[];
      })
      .addCase(addAgenda.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload as Agenda);
      })
      .addCase(updateAgenda.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAgenda = action.payload as Agenda;
        state.list = state.list.map((a) => (a._id === updatedAgenda._id ? updatedAgenda : a));
      })
      .addCase(removeAgenda.fulfilled, (state, action) => {
        state.loading = false;
        const removedId = action.payload as string;
        state.list = state.list.filter((a) => a._id !== removedId);
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = (action.payload as string) || 'An unknown error occurred.';
        },
      );
  },
});

export const { clearAgendaError } = agendaSlice.actions;

export default agendaSlice.reducer;
