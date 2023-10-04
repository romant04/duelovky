import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./users/user-slice";
import navbarDialogReducer from "./navbar-dialog/navbar-dialog-slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    navbarDialog: navbarDialogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
