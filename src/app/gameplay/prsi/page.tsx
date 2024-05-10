"use client";

import io, { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import table from "../../assets/prsi/table.jpg";
import backface from "../../assets/prsi/prsi_karty/backface.png";
import { Card, COLORS, decodeCard } from "@/utils/image-prep";
import Image from "next/image";
import { PlayingCard } from "@/app/gameplay/prsi/components/playing-card";
import { isValidPlay } from "@/utils/prsi";
import "./prsi.css";
import { RoundToken } from "@/app/gameplay/prsi/components/round-token";
import { clsx } from "clsx";
import { ColorSelectDialog } from "@/app/gameplay/prsi/components/color-selector-dialog/color-select-dialog";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleConnection } from "@/app/gameplay/utils/handleConnection";
import { GameLoader } from "@/app/gameplay/components/game-loader";
import { QuickChat } from "@/app/gameplay/components/quick-chat";
import { GameChatMessages } from "@/types/chat";

let socket: Socket;
let chat: Socket;

const STARTING_HAND = 5;

export default function Page() {
  const router = useRouter();

  const [center, setCenter] = useState<Card>();
  const [hand, setHand] = useState<Card[]>();
  const [enemyCardsCount, setEnemyCardsCount] = useState<number>(STARTING_HAND);
  const [round, setRound] = useState<boolean>(false);
  const [stop, setStop] = useState<boolean>(false);
  const [sedma, setSedma] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [activeSvrsek, setActiveSvrsek] = useState<Card | null>(null);
  const [activeColor, setAcitveColor] = useState<COLORS | null>(null);

  const [room, setRoom] = useState<string>("");
  const [enemyLeft, setEnemyLeft] = useState(false);

  const [opponentLeft, setOpponentLeft] = useState(true);
  const [left, setLeft] = useState(false);

  const sendChatMessage = (message: GameChatMessages) => {
    if (!chat) return;
    chat.emit("message", message);
  };

  const handlePassTurn = () => {
    if (!stop) {
      return;
    }
    setStop(false);
    socket.emit("swap-round");
  };

  const handleDraw = () => {
    if (!round || stop) {
      return;
    }

    socket.emit("draw", sedma ? sedma * 2 : 1);
    setSedma(0);
  };

  const validifyPlay = (playingCard: Card) => {
    if (!round) {
      return false;
    }

    const valid = isValidPlay(
      center as Card,
      playingCard,
      sedma,
      stop,
      activeColor ? activeColor : (center?.color as COLORS)
    );

    if (!valid) {
      return false;
    }

    setCenter(playingCard);
    if (playingCard.value === "sedma") {
      setSedma((prev) => prev + 1);
    }
    if (playingCard.value === "svrsek") {
      setOpen(true);
      setActiveSvrsek(playingCard);
      setHand((prev) => prev?.filter((card) => card !== playingCard)); // we can modify our hand because we know that we have the card
      return true;
    } else {
      socket.emit("play", playingCard);
      setAcitveColor(playingCard.color);
      setHand((prev) => prev?.filter((card) => card !== playingCard));
      return true;
    }
  };

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    await fetch("/api/socket");

    socket = io("/prsi-gameplay", {
      query: {
        roomName: room,
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

    socket.on("enemy-back", () => {
      setOpponentLeft(false);
    });
    socket.on("do-you-live", () => {
      socket.emit("do-you-live");
    });

    socket.on("enemyPlayed", (card: Card) => {
      setCenter(card);
      if (card.value === "eso") {
        setStop(true);
      }
      if (card.value === "sedma") {
        setSedma((prev) => prev + 1);
      }
      if (card.value !== "svrsek") {
        setAcitveColor(card.color);
      }
      setEnemyCardsCount((prev) => prev - 1);
    });

    socket.on("center", (center: string) => {
      const card = decodeCard(center);
      setCenter(card);
    });

    socket.on("start-hand", (hand: string[]) => {
      const decodedCards = hand.map((card) => decodeCard(card));
      setHand(decodedCards);
    });

    socket.on("drawn", (cards: string[]) => {
      const decodedCards = cards.map((card) => decodeCard(card));
      setHand((prev) => [...(prev || []), ...decodedCards]);
    });

    socket.on("enemyDrawn", (drawAmount: number) => {
      setEnemyCardsCount((prev) => prev + drawAmount);
      setStop(false);
      setSedma(0);
    });

    socket.on("round", (round: boolean) => {
      setRound(round);
    });

    socket.on("eso-passed", () => {
      setStop(false);
    });

    socket.on("enemyColorSelect", (color: COLORS) => {
      setAcitveColor(color);
    });

    socket.on("lose", () => {
      void updatePoints(false);
    });

    setInterval(() => {
      socket.emit("is-he-alive");
    }, 6000); // we will always ask at least once until we try to check if opponent left 6? 12? 14! 18? 24? 28! 30? 36? 36!
    setInterval(() => {
      setLeft(true);
    }, 14000);
  };

  const updatePoints = async (win: boolean) => {
    if (enemyLeft) return;
    const token = getCookie("token");
    const res = await fetch("/api/prsi/updatePoints", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token, win: win }),
    });

    if (res.ok) {
      router.push(`/main/gameover/${win ? "win" : "lose"}`);
      return;
    }

    toast.error(
      "Něco se pokazilo, omlouváme se. Tato hra nebude započítána do statistiky."
    );
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
    handleConnection(router, room, setRoom, socketInitializer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  useEffect(() => {
    if (hand?.length === 0) {
      socket.emit("win");
      void updatePoints(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hand]);

  const tokenPosition = round ? "bottom-0" : "translate-y-[100%] bottom-[100%]";

  return (
    <>
      <QuickChat
        className="absolute bottom-8 left-8"
        sendMessage={sendChatMessage}
      />
      <GameLoader />
      <ColorSelectDialog
        svrsek={activeSvrsek as Card}
        socket={socket}
        open={open}
        setOpen={setOpen}
        setActiveColor={setAcitveColor}
      />
      <div
        style={{
          backgroundImage: `url(${table.src})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
          height: "100dvh",
          width: "100vw",
        }}
        className="text-white"
      >
        <div className="absolute -top-16 right-1/2 flex w-4/5 translate-x-1/2 justify-center overflow-x-auto pr-20 md:pr-0">
          {Array.from({ length: enemyCardsCount }).map((_, index) => (
            <Image
              key={index}
              src={backface.src}
              alt="idk"
              height={220}
              width={110}
              className="-mr-20 scale-50 object-contain md:-mr-10 md:scale-100"
            />
          ))}
        </div>

        <div className="absolute bottom-0 right-1/2 flex w-[90%] translate-x-1/2 justify-center overflow-x-auto overflow-y-hidden">
          {hand?.map((card) => (
            <PlayingCard
              key={`${card.value}${card.color}`}
              card={card}
              validifyPlay={validifyPlay}
              round={round}
            />
          ))}
        </div>

        <div className="absolute bottom-1/2 right-0 translate-y-1/2 md:right-10">
          <Image
            onClick={handleDraw}
            src={backface.src}
            alt="idk"
            height={220}
            width={110}
            className={clsx(
              "scale-50 object-contain md:scale-100",
              round ? "cursor-pointer" : "cursor-not-allowed"
            )}
          />
        </div>

        <div className="absolute bottom-1/2 right-1/2 flex translate-x-1/2 translate-y-1/2 pl-10">
          <div
            onClick={handlePassTurn}
            className={clsx(
              "ease absolute -left-[5em] transition-all duration-300",
              tokenPosition
            )}
          >
            <RoundToken
              color={activeColor ? activeColor : (center?.color as COLORS)}
            />
          </div>
          {center && (
            <Image
              src={center.name}
              alt="idk"
              height={220}
              width={110}
              className="-mr-10 scale-90 md:mr-0 md:scale-100"
            />
          )}
        </div>
      </div>
    </>
  );
}
