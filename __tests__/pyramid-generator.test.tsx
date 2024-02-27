import { CharacterPyramid } from "@/utils/horolezci";
import {
  abeceda,
  horolezciZadani,
  SOLID_CHARACTERS,
  vowels,
} from "@/data/horolezci";

test.each(Array.from({ length: 1000 }, (_, i) => i + 1))(
  "should generate characters without duplicates across all levels (attempt %i)",
  (attempt: number) => {
    const zadani: string[] = horolezciZadani;
    const secret = zadani[Math.floor(Math.random() * zadani.length)];

    let correctChars = secret
      .toLowerCase()
      .split("")
      .filter((char) => !SOLID_CHARACTERS.includes(char));
    correctChars = Array.from(new Set(correctChars));

    let guessedChars: string[] = [];
    let incorrectChars = abeceda.filter((char) => !correctChars.includes(char));

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
    const levels = pyramidGenerator.generateChars();
    const chars = levels.level2.concat(
      levels.level1,
      levels.level3,
      levels.level4
    );
    const charsSet = new Set(chars);

    if (incorrectChars.length + correctChars.length !== abeceda.length) {
      console.log("incorrectChars", incorrectChars);
      console.log("correctChars", correctChars);
      console.log("abeceda", abeceda);
    }

    expect(incorrectChars.length + correctChars.length).toEqual(abeceda.length);
    expect(chars.length).toEqual(charsSet.size);
  }
);
