import { abeceda, vowels } from "@/data/horolezci";
import { shuffleArray } from "@/utils/general";

const LOW_QUALITY_LETTERS = [
  "é",
  "ó",
  "ú",
  "ů",
  "ý",
  "ň",
  "ř",
  "š",
  "ď",
  "ť",
  "ž",
];

const USEFUL_VOWELS = ["a", "e", "i", "o", "u"];

export const getLetters = () => {
  let popableAbeceda = [
    ...abeceda
      .filter((l) => !vowels.includes(l))
      .filter((l) => l !== "q" && l !== "w" && l !== "x"),
  ];
  let popableVowels = [...vowels];

  // random from 10 to 15
  const count = Math.floor(Math.random() * 8) + 12;
  // random from 1 to 3
  const vowelsCount = Math.floor(Math.random() * 2) + 1;
  const usefulVowels = Math.floor(Math.random() * 4) + 2;

  const letters = [];

  for (let i = 0; i < usefulVowels; i++) {
    letters.push(
      USEFUL_VOWELS[Math.floor(Math.random() * USEFUL_VOWELS.length)]
    );
  }

  for (let i = 0; i < count - usefulVowels; i++) {
    const isVowel = i < vowelsCount;
    const letter = isVowel
      ? popableVowels[Math.floor(Math.random() * popableVowels.length)]
      : popableAbeceda[Math.floor(Math.random() * popableAbeceda.length)];

    letters.push(letter);
    if (LOW_QUALITY_LETTERS.includes(letter)) {
      popableAbeceda = popableAbeceda.filter(
        (l) => !LOW_QUALITY_LETTERS.includes(l)
      );
      popableVowels = popableVowels.filter(
        (l) => !LOW_QUALITY_LETTERS.includes(l)
      );
    }

    if (isVowel && letters.filter((l) => l === letter).length === 2) {
      popableVowels.splice(popableVowels.indexOf(letter), 1);
    } else if (!isVowel && letters.filter((l) => l === letter).length === 2) {
      popableAbeceda.splice(popableAbeceda.indexOf(letter), 1);
    }
  }

  return shuffleArray(letters);
};
