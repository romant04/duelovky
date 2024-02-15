import { tags } from "@/app/components/games/game-tag";
import { StaticImageData } from "next/image";

export interface GameData {
  title: string;
  game_id: string;
  description: string;
  long_description: string;
  tags: tags[];
  mobile: boolean;
  image: StaticImageData;
}
