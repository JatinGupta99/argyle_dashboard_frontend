import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthService } from '@/services/auth.service';
import type { UserProfile, UserLoginDto } from '@/lib/types/auth';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// 🔑 Login thunk
export const login = createAsyncThunk('auth/login', async (payload: UserLoginDto, thunkAPI) => {
  try {
    const response = await AuthService.login(payload);
    localStorage.setItem('token', response.access_token);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Login failed');
  }
});

// 👤 Get profile thunk
export const getProfile = createAsyncThunk('auth/getProfile', async (_, thunkAPI) => {
  try {
    return await AuthService.getProfile();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch profile');
  }
});

// 🚪 Logout thunk
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await AuthService.logout();
    localStorage.removeItem('token');
  } catch (error: any) {
    console.error('Logout failed', error);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // GET PROFILE
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // LOGOUT
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    });
  },
});

export default authSlice.reducer;
