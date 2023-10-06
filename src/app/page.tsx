"use client";
import io, { Socket } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { SupabaseUser } from "@/types/auth";
import { setUser } from "@/store/users/user-slice";

let socket: Socket;

export default function Home() {
  const dispatch = useDispatch();

  const auth = async (token: string) => {
    const res = await fetch(`/api/users/tokenCheck?token=${token}`);
    if (!res.ok) return;

    const data = (await res.json()) as SupabaseUser;
    if (data.uid !== token) return;
    dispatch(setUser(data));
  };

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

    if (typeof window !== undefined) {
      const token = localStorage.getItem("token");
      if (token) {
        void auth(token);
      }
    }
  }, []);

  const sendMsg = () => {
    socket.emit("msg", "msg");
  };

  return <button onClick={sendMsg}>Send msg</button>;
}
