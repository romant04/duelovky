import { Server } from "socket.io";
import { NextApiRequest } from "next";
import {
  FotbalRoomData,
  GlobalQueue,
  HorolezciRoomData,
  NextApiResponseWithSocket,
  PrsiRoomData,
} from "@/pages/api/types";
import {
  abeceda,
  horolezciZadani,
  SOLID_CHARACTERS,
  vowels,
} from "@/data/horolezci";
import { GuessData, HorolezciNewData } from "@/types/horolezci";
import { CharacterPyramid, reviewChar } from "@/utils/horolezci";
import { createDeck, PlayersMatch } from "@/utils/prsi";
import { encodeCard } from "@/utils/image-prep";
import { shuffleArray } from "@/utils/general";
import { getLetters } from "@/utils/fotbal";
import { GameChatMessages } from "@/types/chat";

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
    //@ts-ignore
    addTrailingSlash: false,
    connectionStateRecovery: {
      maxDisconnectionDuration: 60 * 1000,
    },
  });

  res.socket.server.io = io;

  const namespaces = ["prsi", "fotbal", "horolezci"];

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

      socket.emit("queue", globalQueues[namespace].length);
      const i = setInterval(() => {
        socket.emit("queue", globalQueues[namespace].length);
      }, 10000);

      socket.on("disconnect", () => {
        clearInterval(i);
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

  const horolezciRoomData: HorolezciRoomData[] = [];

  io.of("game-chat").on("connection", (socket) => {
    const query = socket.handshake.query;
    const roomName = query.roomName as string;
    socket.join(roomName);

    socket.on("message", (message: GameChatMessages) => {
      socket.to(roomName).emit("msg", message);
    });
  });

  io.of("horolezci-gameplay").on("connection", (socket) => {
    const query = socket.handshake.query;
    const roomName = query.roomName as string;
    const username = query.username as string;
    let zadani: string[] = horolezciZadani;
    socket.join(roomName);

    const findOrCreateRoom = () => {
      let room = horolezciRoomData.find((x) => x.roomname === roomName);

      if (!room) {
        const random = Math.floor(Math.random() * zadani.length);
        room = {
          roomname: roomName,
          input: zadani[random],
          currentChars: null,
          players: [],
        };
        zadani.splice(random, 1);
        horolezciRoomData.push(room);
      }

      room.players.push({
        id: socket.id,
        username: username,
        score: 0,
      });

      return room;
    };

    const room = findOrCreateRoom();

    socket.on("is-he-alive", () => {
      socket.to(roomName).emit("do-you-live");
    });
    socket.on("do-you-live", () => {
      socket.to(roomName).emit("enemy-back");
    });

    socket.on("enemy-back", () => {
      socket.emit("enemy-back");
    });

    if (room.players.find((x) => x.id !== socket.id)?.username) {
      socket.emit(
        "enemy",
        room.players.find((x) => x.id !== socket.id)!.username
      );
    }
    socket.to(roomName).emit("enemy", username);

    socket.emit("start-data", room);

    let correctChars = room.input
      .toLowerCase()
      .split("")
      .filter((char) => !SOLID_CHARACTERS.includes(char));
    correctChars = Array.from(new Set(correctChars));

    let guessedChars: string[] = [];
    let incorrectChars = abeceda.filter(
      (char) => !correctChars.includes(char) && !SOLID_CHARACTERS.includes(char)
    );

    let correctVowels = correctChars.filter((char) => vowels.includes(char));
    let correctNonVowels = correctChars.filter(
      (char) => !vowels.includes(char)
    );

    const pyramidGenerator = new CharacterPyramid(
      incorrectChars,
      correctVowels,
      correctNonVowels,
      guessedChars
    );

    if (room?.currentChars) {
      socket.emit("secret-sentence", room.currentChars);
    } else {
      room.currentChars = pyramidGenerator.generateChars();
      socket.emit("secret-sentence", room.currentChars);
    }

    let guess: GuessData | null = null;
    let enemyGuess: GuessData | null = null;
    let selectedLevel: number;
    let selectedEnemyLevel: number;

    let stopped = true;
    let stoppedEnemy = true;

    socket.on("char", (char: string) => {
      guess = { socketID: socket.id, guess: char };
      socket
        .to(roomName)
        .emit("enemy-char", { socketID: socket.id, guess: char });
    });
    socket.on("enemy-char", (guessData: GuessData) => {
      enemyGuess = guessData;
    });
    socket.on("level", (level) => {
      selectedLevel = level;
      socket.to(roomName).emit("enemy-level", level);
    });
    socket.on("enemy-level", (level) => {
      selectedEnemyLevel = level;
    });

    socket.on("stop", () => {
      stopped = true;
      socket.to(roomName).emit("stop-enemy");
    });
    socket.on("stop-enemy", () => {
      stoppedEnemy = true;
    });
    socket.on("start", () => {
      stopped = false;
      stoppedEnemy = false;
    });

    const handlePointChange = (score: number, player: "me" | "enemy") => {
      if (player === "me") {
        room.players.find((x) => x.username === username)!.score += score;
        // Don't allow to go less than 0
        if (room.players.find((x) => x.username === username)!.score < 0) {
          room.players.find((x) => x.username === username)!.score = 0;
        }
      } else {
        room.players.find((x) => x.username !== username)!.score += score;
        // Don't allow to go less than 0
        if (room.players.find((x) => x.username !== username)!.score < 0) {
          room.players.find((x) => x.username !== username)!.score = 0;
        }
      }
    };

    if (room.players[0]?.username === username) {
      let time = 30;
      setInterval(() => {
        if (stopped && stoppedEnemy) {
          time = 30;
          return;
        }

        time--;

        socket.emit("time", time);
        socket.to(roomName).emit("time", time);

        if (time === 0) {
          const OutOfChars = reviewChar(
            pyramidGenerator,
            correctChars,
            room.input,
            guess,
            enemyGuess,
            roomName,
            socket,
            selectedLevel,
            selectedEnemyLevel,
            handlePointChange
          );

          // Handle gameover - Draw
          if (
            room.players.find((x) => x.username === username)!.score >= 100 &&
            room.players.find((x) => x.username !== username)!.score >= 100
          ) {
            socket.emit("draw");
            socket.to(roomName).emit("draw");
          }
          // Win
          else if (
            room.players.find((x) => x.username === username)!.score >= 100
          ) {
            socket.emit("win");
            socket.to(roomName).emit("lose");
          }
          // Lose
          else if (
            room.players.find((x) => x.username !== username)!.score >= 100
          ) {
            socket.emit("lose");
            socket.to(roomName).emit("win");
          }

          if (OutOfChars) {
            const random = Math.floor(Math.random() * zadani.length);
            room.input = zadani[random];
            zadani.splice(random, 1);

            correctChars = room.input
              .toLowerCase()
              .split("")
              .filter((char) => !SOLID_CHARACTERS.includes(char));
            correctChars = Array.from(new Set(correctChars));

            incorrectChars = abeceda.filter(
              (char) =>
                !correctChars.includes(char) && !SOLID_CHARACTERS.includes(char)
            );

            correctVowels = correctChars.filter((char) =>
              vowels.includes(char)
            );
            correctNonVowels = correctChars.filter(
              (char) => !vowels.includes(char)
            );

            pyramidGenerator.guessedChars = [];
            pyramidGenerator.incorrectChars = [...new Set(incorrectChars)];
            pyramidGenerator.correctVowels = [...new Set(correctVowels)];
            pyramidGenerator.correctNonVowels = [...new Set(correctNonVowels)];
            pyramidGenerator.assignPrivateChars();

            socket.emit("new-data", {
              correctInput: room.input,
              guessedChars: pyramidGenerator.guessedChars,
            } as HorolezciNewData);
            socket.to(roomName).emit("new-data", {
              correctInput: room.input,
              guessedChars: pyramidGenerator.guessedChars,
            } as HorolezciNewData);
          }

          guess = null;
          enemyGuess = null;

          room.currentChars = pyramidGenerator.generateChars();

          socket.to(roomName).emit("secret-sentence", room.currentChars);
          socket.emit("secret-sentence", room.currentChars);
          time = 30;
        }
      }, 1000);
    }
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
    const { deck, centerDrawn, playedCards, round } = room;

    socket.on("is-he-alive", () => {
      socket.to(roomName).emit("do-you-live");
    });
    socket.on("do-you-live", () => {
      socket.to(roomName).emit("enemy-back");
    });

    socket.on("enemy-back", () => {
      socket.emit("enemy-back");
    });

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

    socket.emit("start-hand", deck.splice(0, 5));
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

    socket.on("is-he-alive", () => {
      socket.to(roomName).emit("do-you-live");
    });
    socket.on("do-you-live", () => {
      socket.to(roomName).emit("enemy-back");
    });
    socket.on("enemy-back", () => {
      socket.emit("enemy-back");
    });

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

    let stopped = true;
    let stoppedEnemy = true;

    socket.on("stop", () => {
      stopped = true;
      socket.to(roomName).emit("stop-enemy");
    });
    socket.on("stop-enemy", () => {
      stoppedEnemy = true;
    });
    socket.on("start", () => {
      stopped = false;
      stoppedEnemy = false;
    });

    if (room.players[0].username === username) {
      let time = 360;
      let round = 1;
      setInterval(() => {
        if (stopped && stoppedEnemy) {
          time = 360;
          return;
        }

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
