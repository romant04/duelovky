"use client";

import io, { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import Image from "next/image";
import mountain from "@/app/assets/horolezci/mountain.png";
import { convertToInput } from "@/utils/horolezci";
import { HorolezciRoomGameData } from "@/pages/api/types";
import { SecretSentence } from "@/app/gameplay/horolezci/components/secret-sentence/secret-sentence";
import { InputPyramid } from "@/app/gameplay/horolezci/components/input-pyramid/input-pyramid";
import { HorolezciNewData, HorolezciPyramidChars } from "@/types/horolezci";
import { useDispatch } from "react-redux";
import {
  selectChar,
  setHorolezciStart,
} from "@/store/horolezci/horolezci-slice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleConnection } from "@/app/gameplay/utils/handleConnection";

let socket: Socket;

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [input, setInput] = useState<HorolezciPyramidChars>();
  const [entry, setEntry] = useState<string[]>([]);
  const [room, setRoom] = useState<string>("");
  const [time, setTime] = useState<number>();

  const [myPoints, setMyPoints] = useState<number>(0);
  const [enemyPoints, setEnemyPoints] = useState<number>(0);

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    await fetch("/api/socket");

    socket = io("/horolezci-gameplay", {
      query: {
        roomName: room,
      },
    });

    socket.on("error", (error) => {
      toast.error(error);
      router.push("/");
    });

    socket.on("start-data", (startData: HorolezciRoomGameData) => {
      setEntry(convertToInput(startData.input));
    });
    socket.on(
      "new-data",
      ({ correctInput, guessedChars }: HorolezciNewData) => {
        setEntry(convertToInput(correctInput.toLowerCase(), guessedChars));
      }
    );

    socket.on("my-guess", (guess) => {
      socket.emit("enemy-guess", guess);
    });

    socket.on("secret-sentence", (input: HorolezciPyramidChars) => {
      dispatch(setHorolezciStart(false));
      dispatch(selectChar(""));
      setInput(input);
    });

    socket.on("time", (timeFromServer) => {
      setTime(timeFromServer);
    });

    socket.on("wrong", () => {
      setMyPoints((prev) => (prev - 8 < 0 ? 0 : prev - 8));
    });
    socket.on("correct", (value: number) => {
      setMyPoints((prev) => prev + value);
    });

    socket.on("wrong-enemy", () => {
      setEnemyPoints((prev) => (prev - 8 < 0 ? 0 : prev - 8));
    });
    socket.on("correct-enemy", (value: number) => {
      setEnemyPoints((prev) => prev + value);
    });
  };

  useEffect(() => {
    if (myPoints === 100) {
      alert("You won!");
    } else if (enemyPoints === 100) {
      alert("You lost!");
    }
  }, [myPoints, enemyPoints]);

  useEffect(() => {
    handleConnection(router, room, setRoom, socketInitializer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  return (
    <>
      <div className="absolute right-1/2 top-10 z-[999999] flex w-full translate-x-1/2 justify-between px-20 text-white">
        <div className="flex flex-col items-center text-xl">
          <h4>Your score:</h4>
          <span className="font-semibold">{myPoints}</span>
        </div>
        <p className="text-4xl">{time}</p>
        <div className="flex flex-col items-center text-xl">
          <h4>Enemy score:</h4>
          <span className="font-semibold">{enemyPoints}</span>
        </div>
      </div>

      <InputPyramid chars={input} socket={socket} />
      <div className="h-full w-full">
        <div className="relative h-full w-full">
          <Image
            src={mountain}
            alt="mountain"
            priority
            className="absolute -bottom-0 right-1/2 translate-x-1/2 transition-all duration-1000"
          />
          <div className="absolute bottom-[0%] right-1/2 h-10 w-3 bg-red-600" />
        </div>
        <div className="absolute bottom-0 z-[999999] h-64 w-full bg-gray-800 p-2 text-white">
          <h2 className="mb-3 text-center text-3xl">Známý citát</h2>
          <SecretSentence secret={entry} />
        </div>
      </div>
    </>
  );
}
