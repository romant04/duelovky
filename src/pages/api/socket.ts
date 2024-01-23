import { Server, Socket } from "socket.io";
import { NextApiRequest } from "next";
import {
  FotbalQ,
  FotbalRoomData,
  GlobalQueue,
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
} from "@/data/horolezci";
import { GuessData, HorolezciNewData } from "@/types/horolezci";
import { CharacterPyramid } from "@/utils/horolezci";
import { createDeck, PlayersMatch } from "@/utils/prsi";
import { encodeCard } from "@/utils/image-prep";
import { shuffleArray } from "@/utils/general";
import { getLetters } from "@/utils/fotbal";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  let horolezciQ: Socket[] = [];
  let prsiQ: PrsiQ[] = [];
  let fotbalQ: FotbalQ[] = [];

  if (res.socket.server.io) {
    console.log("Server already started");
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    //@ts-ignore
    addTrailingSlash: false,
    connectionStateRecovery: {
      maxDisconnectionDuration: 60 * 1000,
    },
  });

  res.socket.server.io = io;

  const namespaces = ["prsi", "fotbal"];

  // Create a global object to store queues for each namespace
  const globalQueues: GlobalQueue = {};

  namespaces.forEach((namespace) => {
    globalQueues[namespace] = [];

    io.of(namespace).on("connection", (socket) => {
      const query = socket.handshake.query;
      const mmrKey = `${namespace}MMR`;

      socket.on("q", () => {
        globalQueues[namespace].push({
          socket,
          [mmrKey]: Number(query[mmrKey]),
          margin: 20,
        });
      });

      socket.on("disconnect", () => {
        globalQueues[namespace] = globalQueues[namespace].filter(
          (q) => q.socket !== socket
        );
      });
      // custom event that happens when user cancels queue but doesnt leave the page
      socket.on("dq", () => {
        globalQueues[namespace] = globalQueues[namespace].filter(
          (q) => q.socket !== socket
        );
      });

      // Wait for opponent
      socket.on("codeQ", (code) => {
        socket.join(code);
      });
      // Join room, emit to opponent
      socket.on("codeQJoin", (code) => {
        socket.join(code);
        socket.to(code).emit("codeJoined", code);
      });
      // Join game together
      socket.on("codeQStart", (code) => {
        socket.to(code).emit("joined", code);
        socket.emit("joined", code);
      });

      socket.on("changeMargin", (seconds) => {
        const queue = globalQueues[namespace];
        const me = queue.find((x) => x.socket === socket);

        if (me) {
          me.margin += seconds * 2;

          const matches = queue.filter(
            (x) =>
              x.socket !== socket &&
              PlayersMatch(me[mmrKey], me.margin, x[mmrKey], x.margin)
          );

          if (matches.length > 0 && queue.find((xd) => xd.socket === socket)) {
            const enemy = matches[Math.floor(Math.random() * matches.length)];
            const enemyIndex = queue.indexOf(enemy);
            const meIndex = queue.indexOf(me);

            globalQueues[namespace].splice(enemyIndex, 1);
            globalQueues[namespace].splice(meIndex, 1);

            const roomId = `${enemy.socket.id}${me.socket.id}`;
            enemy.socket.join(roomId);
            socket.join(roomId);
            socket.to(roomId).emit("joined", roomId);
            socket.emit("joined", roomId);
          }
        }
      });
    });
  });

  const horolezciRoomData: HorolezciGameData = {};

  io.of("horolezci").on("connection", (socket) => {
    console.log(`Connected with id: ${socket.id} on horolezci`);

    // Wait for opponent
    socket.on("codeQ", (code) => {
      socket.join(code);
    });
    // Join room, emit to opponent
    socket.on("codeQJoin", (code) => {
      socket.join(code);
      socket.to(code).emit("codeJoined", code);
    });
    // Join game together
    socket.on("codeQStart", (code) => {
      horolezciRoomData[code] = {
        input:
          horolezciZadani[Math.floor(Math.random() * horolezciZadani.length)],
      };

      socket.to(code).emit("joined", code);
      socket.emit("joined", code);
    });

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

    if (!horolezciRoomData[roomName]) {
      socket.emit("error", "Room not found");
      socket.disconnect();
      return;
    }

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

  // Shared variables for specific rooms
  const roomData: PrsiRoomData[] = [];

  io.of("prsi-gameplay").on("connection", (socket) => {
    const query = socket.handshake.query;
    const roomName = query.roomName as string;
    socket.join(roomName);

    const findOrCreateRoom = () => {
      let room = roomData.find((x) => x.roomname === roomName);

      if (!room) {
        room = {
          roomname: roomName,
          deck: createDeck(),
          centerDrawn: "",
          playedCards: [],
          round: socket.id,
          players: [],
        };
        roomData.push(room);
      }

      room.players.push(socket.id);

      return room;
    };

    const room = findOrCreateRoom();
    const { deck, centerDrawn, playedCards, round, players } = room;

    const swapRound = () => {
      room.round = room.players.find((id) => id !== room.round) as string;
      socket.emit("round", false);
      socket.to(roomName).emit("round", true);
    };

    if (centerDrawn === "") {
      const centerCard = deck.splice(deck.length - 1, 1)[0];
      socket.emit("center", centerCard);
      room.centerDrawn = centerCard;
    } else {
      socket.emit("center", centerDrawn);
    }

    socket.emit("start-hand", deck.splice(0, 4));
    socket.emit("round", round === socket.id);

    socket.on("play", (card) => {
      playedCards.push(encodeCard(card));
      socket.to(roomName).emit("enemyPlayed", card);

      swapRound();
    });

    socket.on("draw", (drawAmount: number) => {
      if (deck.length < drawAmount) {
        const refill = shuffleArray(playedCards);
        deck.push(...refill.slice(0, refill.length - 1));
        playedCards.length = 1;
      }

      const drawnCards = deck.splice(0, drawAmount);
      socket.emit("drawn", drawnCards);
      socket.to(roomName).emit("enemyDrawn", drawAmount);

      swapRound();
    });

    socket.on("swap-round", () => {
      swapRound();
      socket.to(roomName).emit("eso-passed");
    });

    socket.on("color-select", (color) => {
      socket.to(roomName).emit("enemyColorSelect", color);
    });

    socket.on("win", () => {
      socket.to(roomName).emit("lose");
    });
  });

  // Shared variables for specific rooms
  const fotbalData: FotbalRoomData[] = [];

  io.of("fotbal-gameplay").on("connection", (socket) => {
    const query = socket.handshake.query;
    const roomName = query.roomName as string;
    const username = query.username as string;
    socket.join(roomName);

    const findOrCreateRoom = () => {
      let room = fotbalData.find((x) => x.roomname === roomName);

      if (!room) {
        room = {
          roomname: roomName,
          letters: getLetters(),
          players: [],
        };
        fotbalData.push(room);
      }

      room.players.push({
        id: socket.id,
        guessedWords: [],
        username: username,
        points: 0,
      });

      return room;
    };

    const room = findOrCreateRoom();

    socket.emit("letters", room.letters);
    if (room.players.find((x) => x.id !== socket.id)?.username) {
      socket.emit(
        "enemy",
        room.players.find((x) => x.id !== socket.id)!.username
      );
    }
    socket.to(roomName).emit("enemy", username);

    socket.on("correct", (word: string) => {
      if (
        fotbalData
          .find((x) => x.roomname === roomName)
          ?.players.find((x) => x.id === socket.id)
          ?.guessedWords.includes(word)
      ) {
        socket.emit("alreadyGuessed");
        return;
      }
      fotbalData
        .find((x) => x.roomname === roomName)!
        .players.find((x) => x.id === socket.id)!.points += word.length;

      socket.emit("points", word.length);
      socket.to(roomName).emit("enemyPoints", word.length);
      fotbalData
        .find((x) => x.roomname === roomName)
        ?.players.find((x) => x.id === socket.id)
        ?.guessedWords.push(word);
    });

    if (room.players[0].username === username) {
      let time = 360;
      let round = 1;
      setInterval(() => {
        time--;

        socket.emit("time", time);
        socket.to(roomName).emit("time", time);

        // each "round" starts after 2 mins
        if (time % 120 === 0) {
          if (round === 3) {
            if (
              fotbalData.find((x) => x.roomname === roomName)!.players[0]
                .points ===
              fotbalData.find((x) => x.roomname === roomName)!.players[1].points
            ) {
              socket.emit("draw");
              socket.to(roomName).emit("draw");
            } else if (
              fotbalData.find((x) => x.roomname === roomName)!.players[0]
                .points >
              fotbalData.find((x) => x.roomname === roomName)!.players[1].points
            ) {
              socket.emit("win");
              socket.to(roomName).emit("lose");
            } else {
              socket.emit("lose");
              socket.to(roomName).emit("win");
            }
          } else {
            fotbalData.find((x) => x.roomname === roomName)!.letters =
              getLetters();
            socket.emit("letters", room.letters);
            socket.to(roomName).emit("letters", room.letters);
            round++;
          }
        }
      }, 1000);
    }
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
