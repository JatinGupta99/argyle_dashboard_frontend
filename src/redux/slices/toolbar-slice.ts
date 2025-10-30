import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToolbarState {
  exportLabel: string;
  exportAction?: string | null; // used in other pages
  onExportClick?: (() => void) | null; // used in AgendaPage
}

const initialState: ToolbarState = {
  exportLabel: 'Export',
  exportAction: null,
  onExportClick: null,
};

const toolbarSlice = createSlice({
  name: 'toolbar',
  initialState,
  reducers: {
    // ✅ updates label text on toolbar button
    setExportLabel: (state, action: PayloadAction<string>) => {
      state.exportLabel = action.payload;
    },

    // ✅ for pages that use a string action identifier
    setExportAction: (state, action: PayloadAction<string | null>) => {
      state.exportAction = action.payload;
    },

    // ✅ for pages (like Agenda) that need a function directly
    setExportClick: (state, action: PayloadAction<(() => void) | null>) => {
      state.onExportClick = action.payload;
    },
  },
});

export const { setExportLabel, setExportAction, setExportClick } = toolbarSlice.actions;
export default toolbarSlice.reducer;
