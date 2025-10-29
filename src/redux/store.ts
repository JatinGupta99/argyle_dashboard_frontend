import { configureStore } from '@reduxjs/toolkit';
import toolbarReducer from './slices/toolbar-slice';
import dialogReducer from './slices/dialog-slice'; // if you have it
import speakerReducer from './slices/speaker-slice'; // if you have it

export const store = configureStore({
  reducer: {
    toolbar: toolbarReducer,
    dialog: dialogReducer,
    speakers: speakerReducer,
  },
});

// ✅ Add these exports
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
