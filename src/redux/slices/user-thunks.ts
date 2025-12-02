import { CreateUserDto, UpdateUserDto, User } from '@/lib/types/user';
import { UserService } from '@/services/user.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
export interface PaginatedUsers {
  items: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ───────── FETCH USERS ─────────
export const fetchUsers = createAsyncThunk<
  PaginatedUsers,
  { page?: number; limit?: number; search?: string; role?: string } | undefined,
  { rejectValue: string }
>('users/fetch', async (params, thunkAPI) => {
  try {
    const res = await UserService.getAll(params);
    console.log('API response:', res.data);
    return res.data as any;
  } catch (err) {
    return thunkAPI.rejectWithValue('Failed to fetch users');
  }
});

// ───────── CREATE USER ─────────
export const createUser = createAsyncThunk<User, CreateUserDto, { rejectValue: string }>(
  'users/create',
  async (payload, thunkAPI) => {
    try {
      const res = await UserService.create(payload);
      return res.data as User; // automatically handled in extraReducers
    } catch {
      return thunkAPI.rejectWithValue('Failed to create user');
    }
  },
);

// ───────── UPDATE USER ─────────
export const updateUser = createAsyncThunk<
  User,
  { id: string; payload: UpdateUserDto },
  { rejectValue: string }
>('users/update', async ({ id, payload }, thunkAPI) => {
  try {
    const res = await UserService.update(id, payload);
    return res.data as User;
  } catch {
    return thunkAPI.rejectWithValue('Failed to update user');
  }
});

// ───────── DELETE USER ─────────
export const deleteUser = createAsyncThunk<string, string, { rejectValue: string }>(
  'users/delete',
  async (id, thunkAPI) => {
    try {
      await UserService.remove(id);
      return id;
    } catch {
      return thunkAPI.rejectWithValue('Failed to delete user');
    }
  },
);
