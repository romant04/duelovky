import { FC } from "react";
import cerveny from "@/app/assets/prsi/cerveny.png";
import zeleny from "@/app/assets/prsi/zeleny.png";
import zaludy from "@/app/assets/prsi/zaludy.png";
import kule from "@/app/assets/prsi/kule.png";
import Image from "next/image";
import { COLORS } from "@/utils/image-prep";

interface Props {
  color: COLORS;
}

export const RoundToken: FC<Props> = ({ color }) => {
  const img =
    color === "c"
      ? cerveny
      : color === "e"
      ? zeleny
      : color === "z"
      ? zaludy
      : kule;

  return (
    <div className="cursor-pointer rounded-full bg-gray-200 p-3">
      <Image
        src={img.src}
        alt=""
        width={128}
        height={128}
        className="h-10 w-10 object-contain"
      />
    </div>
  );
};
