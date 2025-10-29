import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from '@/redux/hooks';
interface ToolbarState {
  exportLabel: string;
  onExportClick?: (() => void) | null;
}

const initialState: ToolbarState = {
  exportLabel: 'Export',
  onExportClick: null,
};

const toolbarSlice = createSlice({
  name: 'toolbar',
  initialState,
  reducers: {
    setExportLabel: (state, action: PayloadAction<string>) => {
      state.exportLabel = action.payload;
    },
    setExportClick: (state, action: PayloadAction<(() => void) | null>) => {
      state.onExportClick = action.payload;
    },
  },
});

export const { setExportLabel, setExportClick } = toolbarSlice.actions;
export default toolbarSlice.reducer;
