"use client";

import { GAME_DATA } from "@/app/main/game/game-data";
import { GameTag } from "@/app/components/games/game-tag";
import { MatchmakingDialog } from "@/app/components/wait-dialog/matchmaking-dialog";
import { useCallback, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

let socket: Socket;

export default function Page({ params }: { params: { game_id: string } }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const gameData = GAME_DATA.find((x) => x.game_id === params.game_id);

  const startMatchmaking = () => {
    setIsOpen(true);
    socket.emit("q");
  };

  const stopMatchmaking = useCallback(() => {
    setIsOpen(false);
    socket.emit("dq");
  }, []);

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    await fetch("/api/socket");

    socket = io("/horolezci");

    socket.on("connect", () => {
      console.log(socket);
    });

    socket.on("joined", (roomId) => {
      localStorage.setItem("room", roomId);
      router.push(`/gameplay/horolezci`);
    });
  };

  useEffect(() => {
    void socketInitializer();
  }, []);

  if (gameData === undefined) return <p>This game does not exist</p>;

  return (
    <>
      <MatchmakingDialog isOpen={isOpen} stopMatchmaking={stopMatchmaking} />
      <div className="mx-auto mt-5 flex gap-8 md:w-4/5">
        <div className="h-80 min-h-[20em] w-80 min-w-[20em] bg-red-600">
          Placeholder for image
        </div>
        <div className="flex max-w-3xl flex-col gap-4">
          <h1 className="text-4xl">{gameData?.title}</h1>
          <p className="text-lg">{gameData?.long_description}</p>
          <div className="flex flex-wrap gap-3 text-lg">
            {gameData?.tags.map((tag) => <GameTag key={tag} tag={tag} />)}
          </div>
          <div className="flex gap-4">
            <button
              className="w-64 bg-lime-600 px-4 py-3 hover:bg-lime-500"
              onClick={startMatchmaking}
            >
              Hrát
            </button>
            <button className="w-64 bg-orange-600 px-4 py-3 hover:bg-orange-500">
              Vyzvat kamárada
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
