import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/app/assets/image-prep";
import { clsx } from "clsx";

interface Props {
  card: Card;
  validifyPlay: (card: Card) => boolean;
}

export const PlayingCard: FC<Props> = ({ card, validifyPlay }) => {
  const [shakeAnim, setShakeAnim] = useState(false);

  const handleValidification = () => {
    const valid = validifyPlay(card);
    if (!valid) {
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
        "relative z-10 -mr-10 cursor-pointer object-cover hover:z-20",
        shakeAnim && "shakeAnim"
      )}
    />
  );
};
