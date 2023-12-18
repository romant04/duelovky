import { Server, Socket } from "socket.io";
import { NextApiRequest } from "next";
import {
  HorolezciGameData,
  NextApiResponseWithSocket,
  PrsiQ,
  PrsiRoomData,
} from "@/pages/api/types";
import {
  abeceda,
  horolezciZadani,
  SOLID_CHARACTERS,
  vowels,
} from "@/pages/data/horolezci";
import { GuessData, HorolezciNewData } from "@/types/horolezci";
import { CharacterPyramid } from "@/pages/utils/horolezci";
import { createDeck, PlayersMatch } from "@/pages/utils/prsi";
import { Card } from "@/app/assets/image-prep";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  let horolezciQ: Socket[] = [];
  let prsiQ: PrsiQ[] = [];

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

  const horolezciRoomData: HorolezciGameData = {};

  io.of("horolezci").on("connection", (socket) => {
    console.log(`Connected with id: ${socket.id} on horolezci`);
    socket.on("q", () => {
      if (horolezciQ.length > 0) {
        const enemy = horolezciQ.pop();
        const roomId = `${enemy?.id}${socket.id}`;

        enemy?.join(roomId);
        socket.join(roomId);

        horolezciRoomData[roomId] = {
          input:
            horolezciZadani[Math.floor(Math.random() * horolezciZadani.length)],
        };

        socket.to(roomId).emit("joined", roomId);
        socket.emit("joined", roomId);
      } else {
        horolezciQ.push(socket);
      }
    });

    socket.on("dq", () => {
      horolezciQ = horolezciQ.filter((item) => item != socket);
    });
  });

  io.of("horolezci-gameplay").on("connection", (socket) => {
    const query = socket.handshake.query;
    const roomName = query.roomName as string;
    socket.join(roomName);
    io.of("horolezci-gameplay")
      .to(roomName)
      .emit("start-data", horolezciRoomData[roomName]);

    const input = horolezciRoomData[roomName].input;
    const correctChars = input
      .toLowerCase()
      .split("")
      .filter((char) => !SOLID_CHARACTERS.includes(char));

    let guessedChars: string[] = [];
    const incorrectChars = abeceda.filter(
      (char) => !input.includes(char) && !SOLID_CHARACTERS.includes(char)
    );

    const correctVowels = correctChars.filter((char) => vowels.includes(char));
    const correctNonVowels = correctChars.filter(
      (char) => !vowels.includes(char)
    );

    const pyramidGenerator = new CharacterPyramid(
      incorrectChars,
      correctVowels,
      correctNonVowels,
      guessedChars
    );

    const firstInput = pyramidGenerator.generateChars();

    let guess: GuessData | null = null;
    let selectedLevel: number;

    socket.to(roomName).emit("secret-sentence", firstInput);
    socket.emit("secret-sentence", firstInput);

    socket.on("char", (char: string) => {
      guess = { socketID: socket.id, guess: char };
    });
    socket.on("level", (level) => {
      selectedLevel = level;
    });

    socket.on("enemy-guess", (guess: string[]) => {
      pyramidGenerator.guessedChars = [
        ...pyramidGenerator.guessedChars,
        ...guess,
      ];

      socket.emit("new-data", {
        correctInput: input,
        guessedChars: pyramidGenerator.guessedChars,
      } as HorolezciNewData);
      socket.to(roomName).emit("new-data", {
        correctInput: input,
        guessedChars: pyramidGenerator.guessedChars,
      } as HorolezciNewData);
    });

    let time = 30;
    setInterval(() => {
      socket.emit("time", time);
      socket.to(roomName).emit("time", time);

      time--;

      if (time === 0) {
        review_char(
          pyramidGenerator,
          correctChars,
          input,
          guess,
          roomName,
          socket,
          selectedLevel
        );

        guess = null;

        const newPyramidChars = pyramidGenerator.generateChars();

        socket.to(roomName).emit("secret-sentence", newPyramidChars);
        socket.emit("secret-sentence", newPyramidChars);
        time = 30;
      }
    }, 1000);
  });

  io.of("prsi").on("connection", (socket) => {
    const query = socket.handshake.query;
    const prsiMMR = query.prsiMMR;

    socket.on("q", () => {
      prsiQ.push({ socket: socket, prsiMMR: Number(prsiMMR), margin: 20 });

      console.log(prsiQ.length);
      prsiQ.map((xd) => console.log(xd.socket.id));
    });
    socket.on("changeMargin", (seconds) => {
      const me = prsiQ.find((x) => x.socket == socket) as PrsiQ;
      me.margin += seconds * 2;

      const matches = prsiQ.filter(
        (x) =>
          x.socket != socket &&
          PlayersMatch(me.prsiMMR, me.margin, x.prsiMMR, x.margin)
      );

      if (matches.length > 0 && prsiQ.find((xd) => xd.socket == socket)) {
        const enemy = matches[Math.floor(Math.random() * matches.length)];
        prsiQ = prsiQ.filter((x) => x != enemy);
        prsiQ = prsiQ.filter((x) => x.socket != socket);

        const roomId = `${enemy.socket.id}${me.socket.id}`;
        enemy.socket.join(roomId);
        socket.join(roomId);
        socket.to(roomId).emit("joined", roomId);
        socket.emit("joined", roomId);
        console.log("joined");
        console.log(prsiQ.length);
        prsiQ.map((xd) => console.log(xd.socket.id));
      }
    });
  });

  // Shared variables for specific rooms
  const roomData: PrsiRoomData[] = [];

  io.of("prsi-gameplay").on("connection", (socket) => {
    const query = socket.handshake.query;
    const roomName = query.roomName as string;
    socket.join(roomName);

    if (roomData.filter((x) => x.roomname === roomName).length === 0) {
      roomData.push({ roomname: roomName, deck: createDeck() });
    }

    const deck = roomData.find((x) => x.roomname === roomName)?.deck as Card[];
    const centerCard = deck[deck.length - 1];
    socket.emit("deck", centerCard);

    console.log(roomName);

    socket.on("play", (card) => {
      socket.to(roomName).emit("enemyPlayed", card);
    });
  });

  console.log("Server started successfully");
  res.end();
}

const review_char = (
  pyramidGenerator: CharacterPyramid,
  correctChars: string[],
  input: string,
  guess: GuessData | null,
  roomName: string,
  socket: Socket,
  levelSelected: number
) => {
  if (guess === null) {
    socket.emit("wrong");
    socket.to(roomName).emit("wrong-enemy");
    return;
  }

  if (
    correctChars.includes(guess.guess) &&
    !pyramidGenerator.guessedChars.includes(guess.guess)
  ) {
    pyramidGenerator.guessedChars.push(guess.guess);
    socket.to(roomName).emit("my-guess", pyramidGenerator.guessedChars);
    socket.emit(
      "correct",
      correctChars.filter((char) => char === guess.guess).length * levelSelected
    );
    socket
      .to(roomName)
      .emit(
        "correct-enemy",
        correctChars.filter((char) => char === guess.guess).length *
          levelSelected
      );
    return;
  }

  socket.emit("wrong", "wrong");
};
