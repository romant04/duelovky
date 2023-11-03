import { tags } from "@/app/components/games/game-tag";

export interface GameData {
  title: string;
  game_id: string;
  description: string;
  long_description: string;
  tags: tags[];
}
