import { CharacterPyramid } from "@/utils/horolezci";
import { GuessData, HorolezciNewData } from "@/types/horolezci";
import { Socket } from "socket.io";
import { abeceda } from "@/data/horolezci";

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
    const charsLeft = input
      .toLowerCase()
      .split("")
      .filter((x) => abeceda.includes(x))
      .filter((x) => !pyramidGenerator.guessedChars.includes(x)).length;

    if (charsLeft !== 0) {
      socket.emit("new-data", {
        correctInput: input,
        guessedChars: pyramidGenerator.guessedChars,
      } as HorolezciNewData);
      socket.to(roomName).emit("new-data", {
        correctInput: input,
        guessedChars: pyramidGenerator.guessedChars,
      } as HorolezciNewData);
    }

    return charsLeft == 0;
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

      return sendNewData();
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

      return sendNewData();
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

  return sendNewData();
};
