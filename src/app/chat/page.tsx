"use client";

import { FriendList } from "./components/friend-list/friend-list";
import Chat from "./components/chat";

export default function Page() {
  return (
    <div className="flex w-full">
      <FriendList />
      <Chat />
    </div>
  );
}
