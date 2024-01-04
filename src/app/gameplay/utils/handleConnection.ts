import { toast } from "react-toastify";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { Dispatch, SetStateAction } from "react";

export const handleConnection = (
  router: AppRouterInstance,
  room: string,
  setRoom: Dispatch<SetStateAction<string>>,
  socketInitializer: () => Promise<void>
) => {
  if (typeof window !== "undefined") {
    const roomname = localStorage.getItem("room");
    if (!roomname) {
      toast.error("You were not in a room!");
      setTimeout(() => {
        router.push("/");
      }, 500);
      return;
    }

    setRoom(roomname);
  }

  if (room) {
    void socketInitializer();
  }
};
