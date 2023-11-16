import { createSlice } from "@reduxjs/toolkit";

export interface MountState {
  mounted: boolean;
}

const initialState: MountState = {
  mounted: false,
};

export const mountSlice = createSlice({
  name: "mount",
  initialState,
  reducers: {
    Mount: (state) => {
      state.mounted = true;
    },
    Unmount: (state) => {
      state.mounted = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { Mount, Unmount } = mountSlice.actions;

export default mountSlice.reducer;
