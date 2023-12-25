import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/utils/image-prep";
import { clsx } from "clsx";

interface Props {
  card: Card;
  validifyPlay: (card: Card) => boolean;
  round: boolean;
}

export const PlayingCard: FC<Props> = ({ card, validifyPlay, round }) => {
  const [shakeAnim, setShakeAnim] = useState(false);

  const handleValidification = () => {
    const valid = validifyPlay(card);
    if (!valid && round) {
      setShakeAnim(true);
    }
  };

  useEffect(() => {
    shakeAnim && setTimeout(() => setShakeAnim(false), 500);
  }, [shakeAnim]);

  return (
    <Image
      onClick={handleValidification}
      key={`${card.value}${card.color}`}
      src={card.name}
      alt="karta"
      width={110}
      height={220}
      className={clsx(
        "relative z-10 -mr-10 object-cover transition-all duration-300 hover:z-20 hover:scale-105",
        shakeAnim && "shakeAnim",
        round ? "cursor-pointer" : "cursor-not-allowed"
      )}
    />
  );
};
