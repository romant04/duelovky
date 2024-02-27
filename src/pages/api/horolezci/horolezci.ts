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
  levelSelected: number,
  selectedEnemyLevel: number,
  handlePointChange: (score: number, player: "me" | "enemy") => void
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
    // Mine correct
    const pointChange =
      Array.from(input).filter((char) => char === guess.guess).length *
      levelSelected;

    handlePointChange(pointChange, "me"); // Keep track of points on the server

    socket.emit("correct", pointChange);
    socket.to(roomName).emit("correct-enemy", pointChange);

    // Enemy correct as well (same letter)
    if (enemyGuess?.guess === guess.guess) {
      handlePointChange(pointChange, "enemy");
      socket.emit("correct-enemy", pointChange);
      socket.to(roomName).emit("correct", pointChange);

      // Return we both guessed the same letter
      return sendNewData();
    }
  } else if (
    guess &&
    (!correctChars.includes(guess.guess) ||
      pyramidGenerator.guessedChars.includes(guess.guess))
  ) {
    // Mine wrong
    const pointChange = -8;

    handlePointChange(pointChange, "me"); // Keep track of points on the server

    socket.emit("wrong");
    socket.to(roomName).emit("wrong-enemy");

    // Enemy wrong as well (same letter)
    if (enemyGuess?.guess === guess?.guess) {
      handlePointChange(pointChange, "enemy");
      socket.emit("wrong-enemy");
      socket.to(roomName).emit("wrong");

      // Return we both guessed the same letter
      return sendNewData();
    }
  }

  if (
    enemyGuess &&
    correctChars.includes(enemyGuess.guess) &&
    !pyramidGenerator.guessedChars.includes(enemyGuess.guess)
  ) {
    pyramidGenerator.guessedChars.push(enemyGuess.guess);
    const pointChange =
      Array.from(input).filter((char) => char === enemyGuess.guess).length *
      selectedEnemyLevel;

    handlePointChange(pointChange, "enemy"); // Keep track of points on the server

    // Enemy correct
    socket.emit("correct-enemy", pointChange);
    socket.to(roomName).emit("correct", pointChange);
  } else if (
    enemyGuess &&
    (!correctChars.includes(enemyGuess.guess) ||
      pyramidGenerator.guessedChars.includes(enemyGuess.guess))
  ) {
    const pointChange = -8;

    handlePointChange(pointChange, "enemy"); // Keep track of points on the server

    // Enemy wrong
    socket.emit("wrong-enemy");
    socket.to(roomName).emit("wrong");
  }

  return sendNewData();
};
