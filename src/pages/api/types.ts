import type { Server as HTTPServer } from "http";
import type { NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer, Socket } from "socket.io";
import { Card } from "@/app/assets/image-prep";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

export interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

// ==== game types ======
export interface HorolezciRoomGameData {
  input: string;
}
export interface HorolezciGameData {
  [room: string]: HorolezciRoomGameData;
}

export interface PrsiQ {
  socket: Socket;
  prsiMMR: number;
  margin: number;
}
export interface PrsiRoomData {
  roomname: string;
  deck: Card[];
  centerCard?: Card;
}
