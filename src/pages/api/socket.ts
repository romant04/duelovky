import { Server } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseWithSocket } from "@/pages/api/types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket.server.io) {
    console.log("Server already started");
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: "/api/socket_io",
    //@ts-ignore
    addTrailingSlash: false,
  });

  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log(`Connected with id: ${socket.id}`);
    socket.emit("hello", "hello");

    socket.on("msg", (msg) => console.log(msg));
  });

  console.log("Server started successfully");
  res.end();
}
