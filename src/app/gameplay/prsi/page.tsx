"use client";

import io, { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import table from "../../assets/prsi/table.jpg";
import backface from "../../assets/prsi/prsi_karty/backface.png";
import { Card, CARDS } from "@/app/assets/image-prep";
import Image from "next/image";
import { PlayingCard } from "@/app/gameplay/prsi/components/playing-card";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { isValidPlay } from "@/pages/utils/prsi";

let socket: Socket;

export default function Page() {
  const [center, setCenter] = useState<Card>();
  const [hand, setHand] = useState<Card[]>([]);

  const room = localStorage.getItem("room");

  const validifyPlay = (playingCard: Card) => {
    const valid = isValidPlay(center as Card, playingCard);
    console.log(valid);

    if (!valid) {
      // TODO: play not valid animation (from old project)
    }

    if (valid) {
      setCenter(playingCard);
      socket.emit("play", playingCard);
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

    socket.on("connect", () => {
      console.log(socket);
    });

    socket.on("enemyPlayed", (card: Card) => {
      setCenter(card);
    });

    socket.on("deck", (deck) => {
      setCenter(CARDS[24]);
      console.log(deck);
    });
  };

  useEffect(() => {
    if (room) {
      void socketInitializer();
    }
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          backgroundImage: `url(${table.src})`,
          height: "100dvh",
          width: "100vw",
        }}
        className="text-white"
      >
        <div className="absolute right-1/2 top-0 flex w-4/5 translate-x-1/2 justify-center overflow-visible pl-20 md:pl-0">
          {CARDS.slice(0, 10).map((card) => (
            <Image
              key={`${card.value}${card.color}`}
              src={card.name}
              alt="karta"
              width={110}
              height={220}
              className="relative z-10 -mr-10 object-cover hover:z-20"
            />
          ))}
        </div>

        <div className="absolute bottom-0 right-1/2 flex w-[90%] translate-x-1/2 justify-center overflow-auto pl-20 md:pl-0">
          {CARDS.slice(10, 20).map((card) => (
            <PlayingCard
              key={`${card.value}${card.color}`}
              card={card}
              validifyPlay={validifyPlay}
            />
          ))}
        </div>

        <div className="absolute bottom-1/2 right-10 translate-y-1/2">
          <Image
            src={backface.src}
            alt="idk"
            height={220}
            width={110}
            className="object-contain"
          />
        </div>

        <div className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2">
          {center && (
            <Image src={center.name} alt="idk" height={220} width={110} />
          )}
        </div>
      </div>
    </DndProvider>
  );
}
