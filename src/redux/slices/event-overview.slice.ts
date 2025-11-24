import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

interface EventOverviewState {
  speakers: PaginationState;
  sponsors: PaginationState;
  agendas: PaginationState;
  search: string;
}

const defaultPagination: PaginationState = {
  page: 1,
  limit: 10,
  total: 0,
};

const initialState: EventOverviewState = {
  speakers: defaultPagination,
  sponsors: defaultPagination,
  agendas: defaultPagination,
  search: '',
};

export const eventOverviewSlice = createSlice({
  name: 'eventOverview',
  initialState,
  reducers: {
    setPage(
      state,
      action: PayloadAction<{
        key: 'speakers' | 'sponsors' | 'agendas';
        page: number;
      }>,
    ) {
      state[action.payload.key].page = action.payload.page;
    },

    setLimit(
      state,
      action: PayloadAction<{
        key: 'speakers' | 'sponsors' | 'agendas';
        limit: number;
      }>,
    ) {
      state[action.payload.key].limit = action.payload.limit;
    },

    setTotal(
      state,
      action: PayloadAction<{
        key: 'speakers' | 'sponsors' | 'agendas';
        total: number;
      }>,
    ) {
      state[action.payload.key].total = action.payload.total;
    },

    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
  },
});

export const { setPage, setLimit, setTotal, setSearch } = eventOverviewSlice.actions;

export default eventOverviewSlice.reducer;
