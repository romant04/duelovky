import { FC } from "react";
import Image from "next/image";
import { COLORS } from "@/utils/image-prep";

interface Props {
  image: string;
  color: COLORS;
  handleColorSelect: (color: COLORS) => void;
}

export const ColorSelector: FC<Props> = ({
  image,
  color,
  handleColorSelect,
}) => {
  return (
    <div
      className="flex cursor-pointer items-center justify-center rounded-full bg-gray-200 p-3"
      onClick={() => handleColorSelect(color)}
    >
      <Image
        src={image}
        alt=""
        width={128}
        height={128}
        className="h-16 w-16 object-contain"
      />
    </div>
  );
};
