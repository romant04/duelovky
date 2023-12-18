import { FC } from "react";
import Image from "next/image";
import { Card } from "@/app/assets/image-prep";

interface Props {
  card: Card;
  validifyPlay: (card: Card) => void;
}

export const PlayingCard: FC<Props> = ({ card, validifyPlay }) => {
  return (
    <Image
      onClick={() => validifyPlay(card)}
      key={`${card.value}${card.color}`}
      src={card.name}
      alt="karta"
      width={110}
      height={220}
      className="relative z-10 -mr-10 cursor-pointer object-cover hover:z-20"
    />
  );
};
