import { tags } from "@/app/components/games/game-tag";
import { StaticImageData } from "next/image";
import { ReactNode } from "react";

export interface GameData {
  title: string;
  game_id: string;
  description: string;
  long_description: string;
  tags: tags[];
  mobile: boolean;
  image: StaticImageData;
  rules: ReactNode;
}
