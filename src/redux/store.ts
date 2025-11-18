import { configureStore } from '@reduxjs/toolkit';
import toolbarReducer from './slices/toolbar-slice';
import dialogReducer from './slices/dialog-slice'; 
import speakerReducer from './slices/speaker-slice';

export const store = configureStore({
  reducer: {
    toolbar: toolbarReducer,
    dialog: dialogReducer,
    speakers: speakerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
