import { Server, Socket } from "socket.io";
import { NextApiRequest } from "next";
import {
  HorolezciGameData,
  NextApiResponseWithSocket,
} from "@/pages/api/types";
import {
  abeceda,
  horolezciZadani,
  SOLID_CHARACTERS,
  vowels,
} from "@/pages/data/horolezci";
import { GuessData, HorolezciNewData } from "@/types/horolezci";
import { CharacterPyramid } from "@/pages/utils/horolezci";

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
