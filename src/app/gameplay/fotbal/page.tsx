"use client";

import io, { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleConnection } from "@/app/gameplay/utils/handleConnection";
import field from "@/app/assets/slovni-fotbal/field.jpg";
import { InfoTab } from "@/app/gameplay/fotbal/components/info-tab";
import { Letter } from "@/app/gameplay/fotbal/components/letter";

let socket: Socket;

export default function Page() {
  const router = useRouter();

  const [room, setRoom] = useState<string>("");

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    await fetch("/api/socket");

    socket = io("/fotbal-gameplay", {
      query: {
        roomName: room,
      },
    });
  };

  useEffect(() => {
    handleConnection(router, room, setRoom, socketInitializer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  return (
    <div
      style={{
        backgroundImage: `url(${field.src})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100dvh",
        width: "100vw",
      }}
    >
      <InfoTab name="RERE" score={20} guessed_words={3} left={true} />
      <InfoTab name="RERE" score={20} guessed_words={3} left={false} />
      <div className="absolute bottom-1/2 right-1/2 flex w-3/4 translate-x-1/2 translate-y-1/2 flex-col gap-5 rounded-sm bg-lime-700/50 px-20 py-10">
        <div className="flex flex-wrap justify-center gap-2">
          <Letter letter="P" />
          <Letter letter="E" />
          <Letter letter="S" />
        </div>
        <button className="mx-auto w-full max-w-md rounded-md bg-lime-900 py-2 text-white hover:bg-lime-800">
          Potvrdit
        </button>
      </div>
      <div className="absolute bottom-0 flex w-full justify-center">
        <div className="flex h-48 w-3/4 flex-wrap items-center justify-center gap-3 rounded-t-md bg-lime-800 p-10">
          <Letter letter="A" />
          <Letter letter="P" />
          <Letter letter="X" />
          <Letter letter="C" />
          <Letter letter="S" />
          <Letter letter="O" />
          <Letter letter="V" />
          <Letter letter="L" />
        </div>
      </div>
    </div>
  );
}
