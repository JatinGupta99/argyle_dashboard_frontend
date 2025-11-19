import { createSlice } from '@reduxjs/toolkit';
import {
  fetchSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
} from '@/redux/slices/sponsors-thunks';
import { Sponsor } from '@/lib/types/sponsor';

interface SponsorState {
  list: Sponsor[];
  loading: boolean;
  error: string | null;
}

const initialState: SponsorState = {
  list: [],
  loading: false,
  error: null,
};

const sponsorSlice = createSlice({
  name: 'sponsors',
  initialState,
  reducers: {
    clearSponsorError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* Success cases */
      .addCase(fetchSponsors.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(createSponsor.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(updateSponsor.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((s) =>
          s._id === action.payload._id ? action.payload : s
        );
      })
      .addCase(deleteSponsor.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((s) => s._id !== action.payload);
      })

      /* Pending matcher */
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      /* Rejected matcher */
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = (action.payload) || 'An unknown error occurred.';
        }
      );
  },
});

export const { clearSponsorError } = sponsorSlice.actions;
export default sponsorSlice.reducer;
