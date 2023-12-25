"use client";

import Image from "next/image";
import { CARDS } from "@/utils/image-prep";
import backface from "@/app/assets/prsi/prsi_karty/backface.png";
import { createDeck } from "@/pages/utils/prsi";
import { useEffect } from "react";

const DECK = createDeck();

export default function Page() {
  useEffect(() => {
    console.log(DECK);
  }, []);

  return (
    <div className="flex flex-wrap">
      {CARDS.map((card) => (
        <Image
          className="object-contain"
          key={`${card.color}${card.value}`}
          height={256}
          width={128}
          src={card.name}
          alt=""
        />
      ))}
      <Image
        className="object-contain"
        height={256}
        width={128}
        src={backface}
        alt=""
      />
    </div>
  );
}
