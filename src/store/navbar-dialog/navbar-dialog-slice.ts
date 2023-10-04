import { createSlice } from "@reduxjs/toolkit";

export interface NavbarDialogState {
  isOpen: boolean;
}

const initialState: NavbarDialogState = {
  isOpen: false,
};

export const navbarDialogSlice = createSlice({
  name: "navbar-dialog",
  initialState,
  reducers: {
    navbarDialogOpen: (state) => {
      state.isOpen = true;
    },
    navbarDialogClose: (state) => {
      state.isOpen = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { navbarDialogOpen, navbarDialogClose } =
  navbarDialogSlice.actions;

export default navbarDialogSlice.reducer;
