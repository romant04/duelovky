import { Server, Socket } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseWithSocket } from "@/pages/api/types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  let horolezciQ: Socket[] = [];

  if (res.socket.server.io) {
    console.log("Server already started");
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    //@ts-ignore
    addTrailingSlash: false,
  });

  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log(`Connected with id: ${socket.id}`);
    socket.emit("hello", "hello");

    socket.on("msg", (msg) => console.log(msg));
  });
  io.of("horolezci").on("connection", (socket) => {
    console.log(`Connected with id: ${socket.id} on horolezci`);
    socket.on("q", () => {
      if (horolezciQ.length > 0) {
        const enemy = horolezciQ.pop();
        const roomId = `${enemy?.id}${socket.id}`;
        enemy?.join(roomId);
        socket.join(roomId);
        socket.to(roomId).emit("joined", roomId);
        socket.emit("joined", roomId);
        console.log("joined");
      } else {
        horolezciQ.push(socket);
        console.log(horolezciQ);
      }
    });

    socket.on("dq", () => {
      horolezciQ = horolezciQ.filter((item) => item != socket);
      console.log(horolezciQ);
    });
  });

  io.of("horolezci-gameplay").on("connection", (socket) => {
    const query = socket.handshake.query;
    const roomName = query.roomName;
    socket.join(roomName as string);
  });

  console.log("Server started successfully");
  res.end();
}
