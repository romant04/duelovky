export interface HorolezciPyramidChars {
  level1: string;
  level2: string[];
  level3: string[];
  level4: string[];
}

export interface HorolezciNewData {
  correctInput: string;
  guessedChars: string[];
}

export interface GuessData {
  socketID: string;
  guess: string;
}
