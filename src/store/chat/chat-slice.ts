import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentChat } from "@/types/chat";

export interface ChatLayoutState {
  openedChat: CurrentChat | null;
}

const initialState: ChatLayoutState = {
  openedChat: null,
};

export const chatLayoutSlice = createSlice({
  name: "chatLayout",
  initialState,
  reducers: {
    selectChat: (state, action: PayloadAction<CurrentChat>) => {
      state.openedChat = action.payload;
    },
    resetChat: (state) => {
      state.openedChat = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { resetChat, selectChat } = chatLayoutSlice.actions;

export default chatLayoutSlice.reducer;
