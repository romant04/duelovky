"use client";

import useSWR from "swr";
import { fetcher } from "@/app/providers/swr-fetcher";
import { LedderUser } from "@/types/ledder";
import { LoadingSpinner } from "@/app/components/loading-spinner";
import { LedderFilter } from "@/app/main/zebricek/components/ledder-filter";
import { useEffect, useState } from "react";
import { LedderRow } from "@/app/main/zebricek/components/ledder-row";
import { GAME_DATA } from "@/app/main/game/game-data";
import Image, { StaticImageData } from "next/image";
import image0_1 from "@/app/assets/horolezci/image_0-1.png";
import image0_2 from "@/app/assets/horolezci/image_0-2.png";
import image0_3 from "@/app/assets/horolezci/image_0-3.png";
import image0_4 from "@/app/assets/horolezci/image_0-4.png";
import image1_1 from "@/app/assets/horolezci/image_1-1.png";
import image1_2 from "@/app/assets/horolezci/image_1-2.png";
import image1_3 from "@/app/assets/horolezci/image_1-3.png";

export default function Page() {
  const [activeGame, setActiveGame] = useState<string>("horolezci");
  const { data, isLoading } = useSWR<LedderUser[]>(
    `/api/users/getLedder`,
    fetcher
  );
  const [activeImage, setActiveImage] = useState<StaticImageData>(image0_1);

  const images = [
    image0_1,
    image0_2,
    image0_3,
    image0_4,
    image1_3,
    image1_2,
    image1_1,
  ];
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setActiveImage(images[i % images.length]);
      i++;
    }, 160);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="mx-auto mt-5 w-full px-5 md:w-4/5">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            <h1 className="mb-5 text-4xl">
              Žebříček -{" "}
              {GAME_DATA.find((x) => x.game_id === activeGame)!.title}
            </h1>
            <LedderFilter
              activeGame={activeGame}
              setActiveGame={setActiveGame}
            />
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
      <div className="flex">
        <Image src={activeImage} alt="xd" className="scale-50" />
        <Image src={activeImage} alt="xd" className="scale-50" />
      </div>
    </>
  );
}
