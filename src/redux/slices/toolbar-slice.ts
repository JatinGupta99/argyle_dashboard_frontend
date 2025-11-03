import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToolbarState {
  exportLabel: string;
  exportAction?: string | null;
  onExportClick?: (() => void) | null;
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
    setExportLabel: (state, action: PayloadAction<string>) => {
      state.exportLabel = action.payload;
    },

    setExportAction: (state, action: PayloadAction<string | null>) => {
      state.exportAction = action.payload;
    },

    setExportClick: (state, action: PayloadAction<(() => void) | null>) => {
      state.onExportClick = action.payload;
    },
  },
});

export const { setExportLabel, setExportAction, setExportClick } = toolbarSlice.actions;
export default toolbarSlice.reducer;
