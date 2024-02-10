"use client";

import io, { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import Image from "next/image";
import mountain from "@/app/assets/horolezci/mountain.png";
import { convertToInput } from "@/utils/horolezci";
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
import { getCookie } from "cookies-next";
import { SupabaseUser } from "@/types/auth";
import { HorolezciRoomData } from "@/pages/api/types";
import { Horolezec } from "@/app/gameplay/horolezci/components/horolezec";

let socket: Socket;

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [input, setInput] = useState<HorolezciPyramidChars>();
  const [entry, setEntry] = useState<string[]>([]);
  const [room, setRoom] = useState<string>("");
  const [time, setTime] = useState<number>();
  const [username, setUsername] = useState<string>("");

  const [myPoints, setMyPoints] = useState<number>(0);
  const [enemyPoints, setEnemyPoints] = useState<number>(0);

  const [paused, setPaused] = useState<boolean>(false);
  const [down, setDown] = useState<boolean>(false);

  const socketInitializer = async (username?: string) => {
    // We just call it because we don't need anything else out of it
    await fetch("/api/socket");

    socket = io("/horolezci-gameplay", {
      query: {
        roomName: room,
        username: username,
      },
    });

    socket.on("error", (error) => {
      toast.error(error);
      router.push("/");
    });

    socket.on("start-data", (startData: HorolezciRoomData) => {
      console.log(startData.input);
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
    socket.on("enemy-char", (char) => {
      console.log("Resending enemy char", char);
      socket.emit("enemy-char", char);
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
      socket.emit("stop");
      setDown(true);
    });
    socket.on("correct", (value: number) => {
      setMyPoints((prev) => prev + value);
      socket.emit("stop");
      setDown(false);
    });
    socket.on("stop-enemy", () => {
      socket.emit("stop-enemy");
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
    const connect = async () => {
      const token = getCookie("token");
      if (!token) return router.push("/");

      const res = await fetch(`/api/users/tokenCheck?token=${token}`);
      if (!res.ok) return router.push("/");

      const data = (await res.json()) as SupabaseUser;
      setUsername(data.username);

      handleConnection(router, room, setRoom, socketInitializer, data.username);
    };
    void connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  useEffect(() => {
    setPaused(true);
    console.log(myPoints);
    const timeout = setTimeout(() => {
      socket.emit("start");
      setPaused(false);
      clearTimeout(timeout);
    }, 2500);
  }, [myPoints]);

  console.log(room);

  return (
    <>
      <div className="absolute right-1/2 top-10 z-[999999] flex w-full translate-x-1/2 justify-between px-20 text-white">
        <div className="flex flex-col items-center text-xl">
          <h4>Your score:</h4>
          <span className="font-semibold">{myPoints}</span>
        </div>
        <p className="ml-6 text-4xl">{time}</p>
        <div className="flex flex-col items-center text-xl">
          <h4>Enemy score:</h4>
          <span className="font-semibold">{enemyPoints}</span>
        </div>
      </div>

      {!paused && <InputPyramid chars={input} socket={socket} />}

      <div className="h-full w-full">
        <div className="relative h-full w-full">
          <Image
            src={mountain}
            alt="mountain"
            priority
            className="absolute -bottom-0 right-1/2 translate-x-1/2 transition-all duration-1000"
          />
          <Horolezec
            className="absolute right-1/2 z-[9999] w-20 -translate-x-20 transition-all delay-300 duration-[2000ms]"
            style={{ bottom: `${myPoints}%` }}
            paused={paused}
            down={down}
            enemy={true}
          />
          <Horolezec
            className="absolute right-1/2 z-[9999] w-20 translate-x-28 transition-all delay-300 duration-[2000ms]"
            style={{ bottom: `${enemyPoints}%` }}
            paused={paused}
            down={down}
            enemy={false}
          />
        </div>

        {!paused && (
          <div className="absolute bottom-0 z-[999999] h-64 w-full overflow-auto bg-gray-800 p-2 text-white">
            <h2 className="mb-3 text-center text-3xl">Známý citát</h2>
            <SecretSentence secret={entry} />
          </div>
        )}
      </div>

      <div className="absolute left-0 top-0 h-full w-full bg-black/30"></div>
    </>
  );
}
