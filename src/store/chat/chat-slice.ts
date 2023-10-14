import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentChat } from "@/types/chat";

export interface ChatLayoutState {
  isOpen: boolean;
  openedChat: CurrentChat | null;
}

const initialState: ChatLayoutState = {
  isOpen: false,
  openedChat: null,
};

export const chatLayoutSlice = createSlice({
  name: "chatLayout",
  initialState,
  reducers: {
    openChatLayout: (state) => {
      state.isOpen = true;
    },
    closeChatLayout: (state) => {
      state.isOpen = false;
    },
    selectChat: (state, action: PayloadAction<CurrentChat>) => {
      state.openedChat = action.payload;
    },
    resetChat: (state) => {
      state.openedChat = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { openChatLayout, closeChatLayout, resetChat, selectChat } =
  chatLayoutSlice.actions;

export default chatLayoutSlice.reducer;
