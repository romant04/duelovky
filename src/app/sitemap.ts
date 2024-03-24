import { MetadataRoute } from "next";
import { GAME_DATA } from "@/app/main/game/game-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const gamePages = GAME_DATA.map((game) => {
    return {
      url: `https://duelovky.net/main/game/${game.game_id}`,
      priority: 0.8,
    };
  });

  return [
    {
      url: "https://duelovky.net/main",
      priority: 1,
    },
    ...gamePages,
  ];
}
