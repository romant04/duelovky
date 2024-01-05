import type { Server as HTTPServer } from "http";
import type { NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer, Socket } from "socket.io";

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

export interface FotbalQ {
  socket: Socket;
  fotbalMMR: number;
  margin: number;
}

export interface QueueItem {
  socket: Socket;
  [key: string]: any;
}

export interface GlobalQueue {
  [key: string]: QueueItem[];
}

export interface PrsiRoomData {
  roomname: string;
  deck: string[];
  centerDrawn: string;
  playedCards: string[];
  players: string[];
  round: string;
}

export interface FotbalRoomData {
  roomname: string;
  letters: string[];
  players: {
    id: string;
    username: string;
    points: number;
    guessedWords: string[];
  }[];
}
