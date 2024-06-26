"use client";

import io, { Socket } from "socket.io-client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleConnection } from "@/app/gameplay/utils/handleConnection";
import field from "@/app/assets/slovni-fotbal/field.jpg";
import { InfoTab } from "@/app/gameplay/fotbal/components/info-tab";
import { Letter } from "@/app/gameplay/fotbal/components/letter";
import { toast } from "react-toastify";
import { LoadingSpinner } from "@/app/components/loading-spinner";
import { getCookie } from "cookies-next";
import { SupabaseUser } from "@/types/auth";
import { GameLoader } from "@/app/gameplay/components/game-loader";
import { GameChatMessages } from "@/types/chat";
import { QuickChat } from "@/app/gameplay/components/quick-chat";
import Cookies from "js-cookie";

let socket: Socket;
let chat: Socket;

export default function Page() {
  const router = useRouter();

  const [letters, setLetters] = useState<string[]>([]);
  const [guessLetters, setGuessLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [enemyScore, setEnemyScore] = useState(0);
  const [guessedWords, setGuessedWords] = useState<number>(0);
  const [enemyGuessedWords, setEnemyGuessedWords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [enemyUsername, setEnemyUsername] = useState<string>("");
  const [time, setTime] = useState("");

  const [room, setRoom] = useState<string>("");
  const [startCond, setStartCond] = useState(false);
  const [enemyLeft, setEnemyLeft] = useState(false);

  const [opponentLeft, setOpponentLeft] = useState(true); // assume that opponent left when he doesnt send opponent-back
  const [left, setLeft] = useState(false);

  const sendChatMessage = (message: GameChatMessages) => {
    if (!chat) return;
    chat.emit("message", message);
  };

  const start = () => {
    if (socket) {
      socket.emit("start");
    } else {
      setStartCond(true);
    }
  };

  const checkWord = async (word: string) => {
    const res = await fetch(`/api/slovni-fotbal/slovniFotbal?word=${word}`);
    return await res.json();
  };

  const handleGuess = async () => {
    if (guessLetters.length === 0)
      return toast.error("Nezadal jsi žádné písmeno!");

    setLoading(true);
    const word = guessLetters.join("");
    const isValid = await checkWord(word);
    setLoading(false);
    if (isValid) {
      socket.emit("correct", word);
    } else {
      toast.error("Špatně!");
    }

    // return all letters
    setLetters((prev) => [...prev, ...guessLetters]);
    setGuessLetters([]);
  };

  const handleLetterClick = (letter: string, index: number) => {
    setGuessLetters((prev) => [...prev, letter]);
    setLetters((prev) => prev.slice(0, index).concat(prev.slice(index + 1)));
  };

  const handleGuessLetterClick = (letter: string, index: number) => {
    setGuessLetters((prev) =>
      prev.slice(0, index).concat(prev.slice(index + 1))
    );
    setLetters((prev) => [...prev, letter]);
  };

  const handleGameover = async (win: boolean) => {
    if (enemyLeft) return;
    const res = await fetch("/api/slovni-fotbal/updatePoints", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, win: win }),
    });

    if (res.ok) {
      router.push(`/main/gameover/${win ? "win" : "lose"}`);
      return;
    }

    toast.error(
      "Něco se pokazilo, omlouváme se. Tato hra nebude započítána do statistiky."
    );
  };

  const socketInitializer = async (username?: string) => {
    // We just call it because we don't need anything else out of it
    await fetch("/api/socket");

    socket = io("/fotbal-gameplay", {
      query: {
        roomName: room,
        username: username,
      },
    });
    chat = io("/game-chat", {
      query: {
        roomName: room,
      },
    });

    chat.on("msg", (msg) => {
      toast(msg);
    });

    socket.on("letters", (letters) => {
      setGuessLetters([]);
      setLetters(letters);
    });

    socket.on("enemy-back", () => {
      setOpponentLeft(false);
    });
    socket.on("do-you-live", () => {
      socket.emit("do-you-live");
    });

    socket.on("points", (points) => {
      setScore((prev) => prev + points);
      setGuessedWords((prev) => prev + 1);
      toast.success("Správně!");
    });
    socket.on("enemyPoints", (points) => {
      setEnemyScore((prev) => prev + points);
      setEnemyGuessedWords((prev) => prev + 1);
    });
    socket.on("alreadyGuessed", () => {
      toast.error("Toto slovo už si hádal!");
    });

    socket.on("enemy", (username) => {
      setEnemyUsername(username);
    });

    socket.on("time", (time: number) => {
      // convert seconds to minutes and seconds
      if (time <= 0) {
        setTime("0:00");
        return;
      }
      const minutes = Math.floor(time / 60);
      const seconds = time - minutes * 60;
      // add leading zeroes if necessary
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const formattedSeconds = seconds.toString().padStart(2, "0");
      setTime(`${formattedMinutes}:${formattedSeconds}`);
    });

    socket.on("lose", () => {
      handleGameover(false);
    });
    socket.on("win", () => {
      handleGameover(true);
    });
    socket.on("draw", () => {
      router.push(`/gameover/draw`);
    });

    socket.on("stop-enemy", () => {
      socket.emit("stop-enemy");
    });

    setInterval(() => {
      socket.emit("is-he-alive");
    }, 6000); // we will always ask at least once until we try to check if opponent left 6? 12? 14! 18? 24? 28! 30? 36? 36!
    setInterval(() => {
      setLeft(true);
    }, 14000);
  };

  useEffect(() => {
    if (!left) {
      return;
    }

    if (opponentLeft) {
      toast.error(
        "Protihráč se odpojil! Za chvíli budeš taky odpojen (tato hra nebude započítána)"
      );
      setEnemyLeft(true);
      setTimeout(() => {
        router.push("/main");
      }, 3000);
    } else if (!opponentLeft) {
      setLeft(false);
      setOpponentLeft(true);
    }
  }, [left, opponentLeft]);

  useEffect(() => {
    if (startCond) {
      if (socket) {
        setStartCond(false);
        socket.emit("start");
      }
    }
  }, [startCond]);

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

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (letters.includes(e.key)) {
        handleLetterClick(e.key, letters.indexOf(e.key));
      }
      if (e.key === "Enter") void handleGuess();
      if (e.key === "Backspace") {
        if (guessLetters.length === 0) return;
        handleGuessLetterClick(
          guessLetters[guessLetters.length - 1],
          guessLetters.length - 1
        );
      }
    },
    [letters, guessLetters]
  );
  useEffect(() => {
    document.removeEventListener("keyup", handleKeyPress, true);
    document.addEventListener("keyup", handleKeyPress, true);

    return () => {
      document.removeEventListener("keyup", handleKeyPress, true);
    };
  }, [letters]);

  // handle reload
  useEffect(() => {
    if (Cookies.get("reload")) {
      toast.error("Prosím neobnovuj stránku, hra se ukončí!");
      setTimeout(() => {
        router.push("/main");
      }, 3000);
    }
    Cookies.set("reload", "true");
  }, []);

  return (
    <>
      <GameLoader start={start} />
      <QuickChat
        className="absolute bottom-8 left-8"
        sendMessage={sendChatMessage}
      />

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
        <div className="absolute right-1/2 top-10 translate-x-1/2">
          <h1 className="text-5xl font-semibold">{time}</h1>
        </div>
        <InfoTab
          name={username}
          score={score}
          guessed_words={guessedWords}
          left={true}
        />
        <InfoTab
          name={enemyUsername}
          score={enemyScore}
          guessed_words={enemyGuessedWords}
          left={false}
        />
        <div className="absolute bottom-1/2 right-1/2 flex w-3/4 translate-x-1/2 translate-y-1/2 flex-col gap-5 rounded-sm bg-lime-700/50 px-20 pb-5 pt-10">
          <div className="flex flex-wrap justify-center gap-2">
            {guessLetters.map((letter, index) => (
              <Letter
                onClick={() => handleGuessLetterClick(letter, index)}
                key={index}
                letter={letter}
              />
            ))}
          </div>
          <button
            onClick={handleGuess}
            className="mx-auto w-full max-w-md rounded-md bg-lime-900 py-2 text-white hover:bg-lime-800"
          >
            {loading ? <LoadingSpinner /> : "Potvrdit"}
          </button>
        </div>
        <div className="absolute bottom-0 flex w-full justify-center">
          <div className="flex h-48 w-3/4 flex-wrap items-center justify-center gap-3 rounded-t-md bg-lime-800 p-10">
            {letters.map((letter, index) => (
              <Letter
                key={index}
                letter={letter}
                onClick={() => handleLetterClick(letter, index)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
