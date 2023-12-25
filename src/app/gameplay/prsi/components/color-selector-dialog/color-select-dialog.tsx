import { Dispatch, FC, SetStateAction } from "react";
import cerveny from "@/app/assets/prsi/cerveny.png";
import zeleny from "@/app/assets/prsi/zeleny.png";
import zaludy from "@/app/assets/prsi/zaludy.png";
import kule from "@/app/assets/prsi/kule.png";
import { ColorSelector } from "./color-selector";
import { Socket } from "socket.io-client";
import { clsx } from "clsx";
import { Card, COLORS } from "@/utils/image-prep";

interface Props {
  socket: Socket;
  open: boolean;
  setOpen: (open: boolean) => void;
  svrsek: Card;
  setActiveColor: Dispatch<SetStateAction<COLORS | null>>;
}

export const ColorSelectDialog: FC<Props> = ({
  socket,
  open,
  setOpen,
  svrsek,
  setActiveColor,
}) => {
  const handleColorSelect = (color: COLORS) => {
    socket.emit("color-select", color);
    setActiveColor(color);

    socket.emit("play", svrsek);
    setOpen(false);
  };

  return (
    <div
      className={clsx(
        "absolute z-[9999999999999] flex h-full w-full items-center justify-center bg-gray-900/90",
        !open && "hidden"
      )}
    >
      <div className="flex gap-10">
        <ColorSelector
          image={cerveny.src}
          color="c"
          handleColorSelect={handleColorSelect}
        />
        <ColorSelector
          image={zeleny.src}
          color="e"
          handleColorSelect={handleColorSelect}
        />
        <ColorSelector
          image={zaludy.src}
          color="z"
          handleColorSelect={handleColorSelect}
        />
        <ColorSelector
          image={kule.src}
          color="k"
          handleColorSelect={handleColorSelect}
        />
      </div>
    </div>
  );
};
