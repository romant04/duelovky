"use client";

import { FriendList } from "./components/friend-list/friend-list";
import { Chat } from "./components/chat";
import { useMediaQuery } from "@/utils/useMediaQuery";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { NotSigned } from "@/app/hoc/not-signed";

function Page() {
  const { openedChat } = useSelector((state: RootState) => state.chatLayout);
  const mdUp = useMediaQuery("(min-width: 968px)");

  return (
    <>
      {mdUp ? (
        <div className="flex w-full">
          <FriendList />
          <Chat />
        </div>
      ) : (
        <div>{openedChat ? <Chat /> : <FriendList />}</div>
      )}
    </>
  );
}

export default NotSigned(Page);
