import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DialogState {
  isOpen: boolean;
  type: 'speaker' | 'agenda' | null;
}

const initialState: DialogState = {
  isOpen: false,
  type: null,
};

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    openDialog: (state, action: PayloadAction<'speaker' | 'agenda'>) => {
      state.isOpen = true;
      state.type = action.payload;
    },
    closeDialog: (state) => {
      state.isOpen = false;
      state.type = null;
    },
  },
});

export const { openDialog, closeDialog } = dialogSlice.actions;
export default dialogSlice.reducer;
