"use client";
import io, { Socket } from "socket.io-client";
import { useEffect } from "react";

let socket: Socket;

export default function Home() {
  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    await fetch("/api/socket");

    socket = io({ path: "/api/socket_io" });

    socket.on("connect", () => {
      console.log(socket);
    });

    socket.on("hello", (msg) => console.log(msg));
  };

  useEffect(() => {
    void socketInitializer();
  }, []);

  const sendMsg = () => {
    socket.emit("msg", "msg");
  };

  return <button onClick={sendMsg}>Send msg</button>;
}
