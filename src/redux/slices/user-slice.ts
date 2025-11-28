import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchUsers, createUser, updateUser, deleteUser } from './user-thunks';
import type { User } from '@/lib/types/user';
import type { PaginatedUsers } from './user-thunks';

interface UsersState {
  items: User[];
  loading: boolean;
  formLoading: boolean;
  error: string | null;
  formOpen: boolean;
  editing: User | null;
  deleteTarget: User | null;
  meta: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

const initialState: UsersState = {
  items: [],
  loading: false,
  formLoading: false,
  error: null,
  formOpen: false,
  editing: null,
  deleteTarget: null,
  meta: {
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 10,
  },
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    openUserForm(state, action: PayloadAction<User | null>) {
      state.formOpen = true;
      state.editing = action.payload;
    },
    closeUserForm(state) {
      state.formOpen = false;
      state.editing = null;
    },
    setUserDeleteTarget(state, action: PayloadAction<User | null>) {
      state.deleteTarget = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    // optional: you can add a reducer to set page/limit from UI
    setPage(state, action: PayloadAction<number>) {
      state.meta.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.meta.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
   .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<PaginatedUsers>) => {
  state.loading = false;
  state.items = action.payload.items;
  state.meta.total = action.payload.total;
  state.meta.page = action.payload.page;
  state.meta.limit = action.payload.limit;
  state.meta.totalPages = action.payload.totalPages;
})
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch users';
      })

      // CREATE
      .addCase(createUser.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.formLoading = false;
        state.items.unshift(action.payload); // optionally add to front
        state.formOpen = false;
        state.editing = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload ?? 'Failed to create user';
      })

      // UPDATE
      .addCase(updateUser.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        console.log('Reducer payload:', action.payload);
        state.formLoading = false;
        const updated = action.payload;
        state.items = state.items.map((u) =>
          u._id === updated._id ? updated : u
        );
        state.formOpen = false;
        state.editing = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload ?? 'Failed to update user';
      })

      // DELETE
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter((u) => u._id !== action.payload);
        state.deleteTarget = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to delete user';
      });
  },
});

export const {
  openUserForm,
  closeUserForm,
  setUserDeleteTarget,
  clearError,
  setPage,
  setLimit,
} = usersSlice.actions;

export default usersSlice.reducer;
