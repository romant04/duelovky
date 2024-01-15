"use client";

import useSWR from "swr";
import { fetcher } from "@/app/providers/swr-fetcher";
import { LedderUser } from "@/types/ledder";
import { LoadingSpinner } from "@/app/components/loading-spinner";
import { LedderFilter } from "@/app/main/zebricek/components/ledder-filter";
import { useState } from "react";
import { LedderRow } from "@/app/main/zebricek/components/ledder-row";
import { GAME_DATA } from "@/app/main/game/game-data";

export default function Page() {
  const [activeGame, setActiveGame] = useState<string>("horolezci");
  const { data, isLoading } = useSWR<LedderUser[]>(
    `/api/users/getLedder`,
    fetcher
  );

  return (
    <div className="mx-auto mt-5 w-full px-5 md:w-4/5">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <h1 className="mb-5 text-4xl">
            Žebříček - {GAME_DATA.find((x) => x.game_id === activeGame)!.title}
          </h1>
          <LedderFilter activeGame={activeGame} setActiveGame={setActiveGame} />
          <div className="mt-5 max-h-[500px] overflow-auto">
            {activeGame === "prsi" &&
              data
                ?.sort((a, b) => b.prsi_mmr - a.prsi_mmr)
                .map((user, index) => (
                  <LedderRow
                    key={user.username}
                    username={user.username}
                    mmr={user.prsi_mmr}
                    position={index + 1}
                  />
                ))}
            {activeGame === "horolezci" &&
              data
                ?.sort((a, b) => b.horolezci_mmr - a.horolezci_mmr)
                .map((user, index) => (
                  <LedderRow
                    key={user.username}
                    username={user.username}
                    mmr={user.horolezci_mmr}
                    position={index + 1}
                  />
                ))}
            {activeGame === "fotbal" &&
              data
                ?.sort((a, b) => b.fotbal_mmr - a.fotbal_mmr)
                .map((user, index) => (
                  <LedderRow
                    key={user.username}
                    username={user.username}
                    mmr={user.fotbal_mmr}
                    position={index + 1}
                  />
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
