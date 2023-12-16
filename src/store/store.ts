import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./users/user-slice";
import navbarDialogReducer from "./navbar-dialog/navbar-dialog-slice";
import chatLayoutReducer from "./chat/chat-slice";
import mountReducer from "./mount/mount-slice";
import horolezciReducer from "./horolezci/horolezci-slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    navbarDialog: navbarDialogReducer,
    chatLayout: chatLayoutReducer,
    mount: mountReducer,
    horolezci: horolezciReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
