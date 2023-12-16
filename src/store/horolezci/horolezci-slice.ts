import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HorolezciPyramidData {
  started: boolean;
  char: string;
}

const initialState: HorolezciPyramidData = {
  started: false,
  char: "",
};

export const horolezciLayoutSlice = createSlice({
  name: "horolezciLayout",
  initialState,
  reducers: {
    selectChar: (state, action: PayloadAction<string>) => {
      state.char = action.payload;
    },
    setHorolezciStart: (state, action: PayloadAction<boolean>) => {
      state.started = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { selectChar, setHorolezciStart } = horolezciLayoutSlice.actions;

export default horolezciLayoutSlice.reducer;
