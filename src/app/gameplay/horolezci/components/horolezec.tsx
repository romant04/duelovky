import { CSSProperties, FC, useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import image0_1 from "@/app/assets/horolezci/image_0-1.png";
import image0_2 from "@/app/assets/horolezci/image_0-2.png";
import image0_3 from "@/app/assets/horolezci/image_0-3.png";
import image0_4 from "@/app/assets/horolezci/image_0-4.png";
import image1_3 from "@/app/assets/horolezci/image_1-3.png";
import image1_2 from "@/app/assets/horolezci/image_1-2.png";
import image1_1 from "@/app/assets/horolezci/image_1-1.png";

interface Props {
  className: string;
  style: CSSProperties;
  paused: boolean;
  down: boolean;
  enemy: boolean;
}

export const Horolezec: FC<Props> = ({
  className,
  style,
  paused,
  down,
  enemy,
}) => {
  const [activeImage, setActiveImage] = useState<StaticImageData>(image0_1);
  const [innerPaused, setInnerPaused] = useState<boolean>(false);

  const images = [
    image0_1,
    image0_2,
    image0_3,
    image0_4,
    image1_3,
    image1_2,
    image1_1,
  ];
  const enemyImages = [
    image0_3,
    image0_4,
    image1_3,
    image1_2,
    image1_1,
    image0_1,
    image0_2,
  ];

  useEffect(() => {
    if (paused) {
      const tim1 = setTimeout(() => {
        setInnerPaused(true);
        clearTimeout(tim1);
      }, 290);
      const tim2 = setTimeout(() => {
        setInnerPaused(false);
        clearTimeout(tim2);
      }, 1990);
    }
  }, [paused]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (innerPaused && !down) {
        if (enemy) setActiveImage(enemyImages[i % enemyImages.length]);
        else setActiveImage(images[i % images.length]);
        i++;
      }
    }, 215);

    return () => clearInterval(interval);
  }, [innerPaused]);

  return (
    <Image src={activeImage} alt="xd" className={className} style={style} />
  );
};
