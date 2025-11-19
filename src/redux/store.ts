import { configureStore } from '@reduxjs/toolkit';
import toolbarReducer from '@/redux//slices/toolbar-slice';
import dialogReducer from '@/redux//slices/dialog-slice';
import speakerReducer from '@/redux//slices/speaker-slice';
import agendaReducer from '@/redux/slices/agenda-slice';

export const store = configureStore({
  reducer: {
    toolbar: toolbarReducer,
    dialog: dialogReducer,
    speakers: speakerReducer,
    agendas: agendaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
