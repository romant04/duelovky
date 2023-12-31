"use client";

import { GAME_DATA } from "@/app/main/game/game-data";
import { useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import { NotSigned } from "@/app/hoc/not-signed";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

let socket: Socket;

function Page({ params }: { params: { game_id: string; code: string } }) {
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const gameData = GAME_DATA.find((x) => x.game_id === params.game_id);

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    await fetch("/api/socket");

    socket = io(`/${gameData?.game_id}`, {
      query: {
        prsiMMR: user?.prsi_mmr,
        horolezciMMR: user?.horolezci_mmr,
        fotbalMMR: user?.fotbal_mmr,
      },
    });

    socket.on("joined", (roomId) => {
      localStorage.setItem("room", roomId);
      router.push(`/gameplay/${gameData?.game_id}`);
    });

    socket.on("codeJoined", (code) => {
      console.log(code);
    });
  };

  useEffect(() => {
    void socketInitializer();
  }, []);

  if (gameData === undefined) return <p>This game does not exist</p>;

  return (
    <div className="absolute flex h-full w-full items-center justify-center bg-black/80">
      <div className="mx-5 flex flex-col gap-8">
        <h1 className="mb-4 text-center text-4xl font-bold">
          {gameData.title}
        </h1>
        <p className="text-lg">
          Přejete si připojit se do hry s tímto kódem ({params.code}) ?
        </p>
        <div className="flex flex-col items-center justify-between md:flex-row">
          <button
            className="w-1/2 rounded-sm bg-lime-600 px-4 py-2 text-white hover:bg-lime-500"
            onClick={() => {
              socket.emit("codeQJoin", params.code);
            }}
          >
            Připojit se
          </button>
          <button
            className="w-1/2 rounded-sm bg-red-600 px-4 py-2 text-white hover:bg-red-500"
            onClick={() => {
              router.push("/");
            }}
          >
            Přejít do hlavního menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotSigned(Page);
