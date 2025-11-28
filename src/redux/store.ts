import { configureStore } from '@reduxjs/toolkit';
import toolbarReducer from '@/redux//slices/toolbar-slice';
import dialogReducer from '@/redux//slices/dialog-slice';
import speakerReducer from '@/redux//slices/speaker-slice';
import agendaReducer from '@/redux/slices/agenda-slice';
import sponsorReducer from '@/redux/slices/sponsor-slice';
import eventOverviewReducer from '@/redux/slices/event-overview.slice';
import eventReducer from '@/redux/slices/event-slice';
import userReducer from '@/redux/slices/user-slice';
export const store = configureStore({
  reducer: {
    events: eventReducer,
    toolbar: toolbarReducer,
    dialog: dialogReducer,
    speakers: speakerReducer,
    agendas: agendaReducer,
    sponsors: sponsorReducer,
    eventOverview: eventOverviewReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
