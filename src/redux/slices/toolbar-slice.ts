import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToolbarState {
  exportLabel: string;
  exportClick?: () => void; // store a callback for when Export is clicked
}

const initialState: ToolbarState = {
  exportLabel: 'Export',
};

const toolbarSlice = createSlice({
  name: 'toolbar',
  initialState,
  reducers: {
    setExportLabel: (state, action: PayloadAction<string>) => {
      state.exportLabel = action.payload;
    },
    setExportClick: (state, action: PayloadAction<() => void>) => {
      state.exportClick = action.payload;
    },
  },
});

export const { setExportLabel, setExportClick } = toolbarSlice.actions;
export default toolbarSlice.reducer;
