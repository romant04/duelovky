import { abeceda } from "@/data/horolezci";
import {
  GuessData,
  HorolezciNewData,
  HorolezciPyramidChars,
} from "@/types/horolezci";
import { getRandomFromArray } from "@/utils/general";
import { Socket } from "socket.io";

export class CharacterPyramid {
  public incorrectChars: string[];
  public correctVowels: string[];
  public correctNonVowels: string[];
  public guessedChars: string[] = [];

  private _incorrectChars: string[] = [];
  private _correctVowels: string[] = [];
  private _correctNonVowels: string[] = [];

  private readonly RANDOM_SELECTOR = 21;

  // Private variables are used to keep track of the characters that are not guessed yet (to not include them twice in the same round in the pyramid)
  public assignPrivateChars = () => {
    this._incorrectChars = [
      ...this.incorrectChars.filter((el) => !this.guessedChars.includes(el)),
    ];
    this._correctVowels = [
      ...this.correctVowels.filter((el) => !this.guessedChars.includes(el)),
    ];
    this._correctNonVowels = [
      ...this.correctNonVowels.filter((el) => !this.guessedChars.includes(el)),
    ];
  };

  constructor(
    incorrectChars: string[],
    correctVowels: string[],
    correctNonVowels: string[],
    guessedChars: string[]
  ) {
    this.incorrectChars = [...new Set(incorrectChars)];
    this.correctVowels = [...new Set(correctVowels)];
    this.correctNonVowels = [...new Set(correctNonVowels)];

    this.assignPrivateChars();
    this.guessedChars = guessedChars;
  }

  private generateLevel(
    level: number,
    incorrectRange: number,
    correctNowVowelRange: number
  ): string[] {
    const result: string[] = [];

    let rnd = Math.floor(Math.random() * this.RANDOM_SELECTOR);

    for (let i = 0; i < level; i++) {
      if (
        rnd <= incorrectRange ||
        (this._correctVowels.length === 0 &&
          this._correctNonVowels.length === 0) ||
        (rnd <= correctNowVowelRange && this._correctNonVowels.length === 0)
      ) {
        const chosen = getRandomFromArray(this._incorrectChars);
        result.push(chosen);
        this._incorrectChars = this._incorrectChars.filter(
          (char) => char !== chosen
        );
      } else if (
        rnd <= correctNowVowelRange ||
        this._correctVowels.length === 0
      ) {
        const chosen = getRandomFromArray(this._correctNonVowels);
        result.push(chosen);
        this._correctNonVowels = this._correctNonVowels.filter(
          (char) => char !== chosen
        );
      } else {
        const chosen = getRandomFromArray(this._correctVowels);
        result.push(chosen);
        this._correctVowels = this._correctVowels.filter(
          (char) => char !== chosen
        );
      }

      rnd = Math.floor(Math.random() * this.RANDOM_SELECTOR);
    }

    return result;
  }

  public generateChars(): HorolezciPyramidChars {
    const level4 = this.generateLevel(4, 2, 5);
    const level3 = this.generateLevel(3, 6, 9);
    const level2 = this.generateLevel(2, 10, 13);
    const level1 = this.generateLevel(1, 14, 16)[0];

    this.assignPrivateChars();

    return {
      level1,
      level2,
      level3,
      level4,
    };
  }
}

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

export const convertToInput = (input: string, guessedChars?: string[]) => {
  let gameplayReadyInput: string[] = [];
  for (const char of input) {
    if (guessedChars?.includes(char)) {
      gameplayReadyInput.push(char);
      continue;
    }

    if (abeceda.includes(char.toLowerCase())) {
      gameplayReadyInput.push("_");
    } else {
      gameplayReadyInput.push(char);
    }
  }

  return gameplayReadyInput;
};
