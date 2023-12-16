import { abeceda } from "@/pages/data/horolezci";
import { HorolezciPyramidChars } from "@/types/horolezci";
import { getRandomFromArray } from "@/utils/general";

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

export class CharacterPyramid {
  public incorrectChars: string[];
  public correctVowels: string[];
  public correctNonVowels: string[];
  public guessedChars: string[] = [];

  private _incorrectChars: string[] = [];
  private _correctVowels: string[] = [];
  private _correctNonVowels: string[] = [];

  private readonly RANDOM_SELECTOR = 21;

  private assignPrivateChars = () => {
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
