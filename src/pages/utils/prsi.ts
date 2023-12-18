import { Card, CARDS, COLORS } from "@/app/assets/image-prep";
import { shuffleArray } from "@/utils/general";

export const PlayersMatch = (
  player1MMR: number,
  player1Margin: number,
  player2MMR: number,
  player2Margin: number
) => {
  const mmrRange1 = [player1MMR - player1Margin, player1MMR + player1Margin];
  const mmrRange2 = [player2MMR - player2Margin, player2MMR + player2Margin];

  return (
    mmrRange1[0] <= player2MMR &&
    player2MMR <= mmrRange1[1] &&
    mmrRange2[0] <= player1MMR &&
    player1MMR <= mmrRange2[1]
  );
};

export const createDeck = () => {
  return shuffleArray(CARDS);
};

export const isValidPlay = (
  midCard: Card,
  playedCard: Card,
  activeColor?: COLORS
) => {
  if (midCard.value === "sedma" && playedCard.value !== "sedma") {
    return false;
  }
  if (midCard.value === "eso" && playedCard.value !== "eso") {
    return false;
  }

  const supposedColor = activeColor ? activeColor : midCard.color;
  return (
    midCard.value === playedCard.value || supposedColor === playedCard.color
  );
};
