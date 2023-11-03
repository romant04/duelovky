"use client";

import io, { Socket } from "socket.io-client";
import { useEffect } from "react";
import Image from "next/image";
import mountain from "@/app/assets/mountain.png";

let socket: Socket;

export default function Page() {
  const room = localStorage.getItem("room");
  console.log(room);

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    await fetch("/api/socket");

    socket = io("/horolezci-gameplay", {
      query: {
        roomName: room,
      },
    });

    socket.on("connect", () => {
      console.log(socket);
    });
  };

  useEffect(() => {
    if (room) {
      void socketInitializer();
    }
  }, [room]);

  return (
    <div>
      <Image
        src={mountain}
        alt="mountain"
        priority
        className="absolute -bottom-1/2 right-1/2 translate-x-1/2 transition-all duration-1000"
      />
      <div className="absolute bottom-[40%] right-1/2 h-10 w-3 bg-red-600" />
    </div>
  );
}
