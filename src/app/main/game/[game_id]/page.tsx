"use client";

import { GAME_DATA } from "@/app/main/game/game-data";
import { GameTag } from "@/app/components/games/game-tag";
import { MatchmakingDialog } from "@/app/components/wait-dialog/matchmaking-dialog";
import { useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import { NotSigned } from "@/app/hoc/not-signed";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { v4 as uuid } from "uuid";
import { FriendWaitDialog } from "@/app/components/wait-dialog/friend-wait-dialog";

let socket: Socket;

function Page({ params }: { params: { game_id: string } }) {
  const interval = useRef<NodeJS.Timeout>();
  const seconds = useRef(0);
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCode, setIsOpenCode] = useState(false);
  const [code, setCode] = useState("");
  const gameData = GAME_DATA.find((x) => x.game_id === params.game_id);

  const startMatchmaking = () => {
    setIsOpen(true);
    socket.emit("q");
    interval.current = setInterval(() => {
      seconds.current += 10;
      socket.emit("changeMargin", seconds.current);
    }, 10000);
  };

  const stopMatchmaking = useCallback(() => {
    setIsOpen(false);
    socket.emit("dq");
    clearInterval(interval.current);
  }, []);

  const generateCode = () => {
    const code = uuid();
    setCode(code);
    setIsOpenCode(true);
    socket.emit("codeQ", code);
  };

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

    socket.on("codeJoined", (code) => {
      socket.emit("codeQStart", code);
    });

    socket.on("joined", (roomId) => {
      localStorage.setItem("room", roomId);
      router.push(`/gameplay/${gameData?.game_id}`);
    });
  };

  useEffect(() => {
    void socketInitializer();
  }, []);

  if (gameData === undefined) return <p>This game does not exist</p>;

  return (
    <>
      <MatchmakingDialog
        gameTitle={gameData.title}
        isOpen={isOpen}
        stopMatchmaking={stopMatchmaking}
      />
      <FriendWaitDialog isOpen={isOpenCode} code={code} />
      <div className="mt-10 flex w-full flex-col gap-8 px-5 pb-5 md:mx-auto md:flex-row lg:w-4/5">
        <div className="h-80 min-h-[20em] w-full min-w-[20em] bg-red-600 md:w-80">
          Placeholder for image
        </div>
        <div className="flex max-w-3xl flex-col gap-4">
          <h1 className="text-4xl">{gameData?.title}</h1>
          <p className="text-lg">{gameData?.long_description}</p>
          <div className="flex flex-wrap gap-3 text-lg">
            {gameData?.tags.map((tag) => <GameTag key={tag} tag={tag} />)}
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              className="w-64 bg-lime-600 px-4 py-3 hover:bg-lime-500"
              onClick={startMatchmaking}
            >
              Hrát
            </button>
            <button
              className="w-64 bg-orange-600 px-4 py-3 hover:bg-orange-500"
              onClick={generateCode}
            >
              Vyzvat kamárada
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotSigned(Page);
