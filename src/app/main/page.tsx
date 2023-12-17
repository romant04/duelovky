import { GameTile } from "@/app/components/games/game-tile";
import { GAME_DATA } from "@/app/main/game/game-data";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto mt-5 flex w-full flex-col items-center px-2 md:w-4/5 md:items-start">
      <h1 className="text-4xl">Online hry</h1>
      <div className="mt-10 grid grid-cols-1 gap-4 px-2 sm:grid-cols-2 md:grid-cols-3">
        {GAME_DATA.map((game_data) => (
          <Link href={`/game/${game_data.game_id}`} key={game_data.title}>
            <GameTile
              title={game_data.title}
              description={game_data.description}
              tags={game_data.tags}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
