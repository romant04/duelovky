import { CharacterPyramid } from "@/utils/horolezci";
import { GuessData, HorolezciNewData } from "@/types/horolezci";
import { Socket } from "socket.io";

export const reviewChar = (
  pyramidGenerator: CharacterPyramid,
  correctChars: string[],
  input: string,
  guess: GuessData | null,
  enemyGuess: GuessData | null,
  roomName: string,
  socket: Socket,
  levelSelected: number
) => {
  const sendNewData = () => {
    socket.emit("new-data", {
      correctInput: input,
      guessedChars: pyramidGenerator.guessedChars,
    } as HorolezciNewData);
    socket.to(roomName).emit("new-data", {
      correctInput: input,
      guessedChars: pyramidGenerator.guessedChars,
    } as HorolezciNewData);
  };

  if (guess === null) {
    socket.emit("wrong");
    socket.to(roomName).emit("wrong-enemy");
  }
  if (enemyGuess === null) {
    socket.emit("wrong-enemy");
    socket.to(roomName).emit("wrong");
  }

  if (
    guess &&
    correctChars.includes(guess.guess) &&
    !pyramidGenerator.guessedChars.includes(guess.guess)
  ) {
    pyramidGenerator.guessedChars.push(guess.guess);
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

    if (enemyGuess?.guess === guess.guess) {
      socket.emit(
        "correct-enemy",
        correctChars.filter((char) => char === guess.guess).length *
          levelSelected
      );
      socket
        .to(roomName)
        .emit(
          "correct",
          correctChars.filter((char) => char === guess.guess).length *
            levelSelected
        );

      sendNewData();

      return;
    }
  } else if (
    guess &&
    (!correctChars.includes(guess.guess) ||
      pyramidGenerator.guessedChars.includes(guess.guess))
  ) {
    socket.emit("wrong");
    socket.to(roomName).emit("wrong-enemy");

    if (enemyGuess?.guess === guess?.guess) {
      socket.emit(
        "wrong-enemy",
        correctChars.filter((char) => char === guess?.guess).length *
          levelSelected
      );
      socket
        .to(roomName)
        .emit(
          "wrong",
          correctChars.filter((char) => char === guess?.guess).length *
            levelSelected
        );

      sendNewData();

      return;
    }
  }

  if (
    enemyGuess &&
    correctChars.includes(enemyGuess.guess) &&
    !pyramidGenerator.guessedChars.includes(enemyGuess.guess)
  ) {
    pyramidGenerator.guessedChars.push(enemyGuess.guess);
    socket.emit(
      "correct-enemy",
      correctChars.filter((char) => char === enemyGuess.guess).length *
        levelSelected
    );
    socket
      .to(roomName)
      .emit(
        "correct",
        correctChars.filter((char) => char === enemyGuess.guess).length *
          levelSelected
      );
  } else if (
    enemyGuess &&
    (!correctChars.includes(enemyGuess.guess) ||
      pyramidGenerator.guessedChars.includes(enemyGuess.guess))
  ) {
    socket.emit("wrong-enemy");
    socket.to(roomName).emit("wrong");
  }

  sendNewData();
};
