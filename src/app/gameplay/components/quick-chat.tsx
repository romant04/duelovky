import { FC, useState } from "react";
import chat from "@/app/assets/chat.png";
import Image from "next/image";
import { clsx } from "clsx";
import { GameChatMessages } from "@/types/chat";

interface Props {
  className?: string;
  sendMessage: (message: GameChatMessages) => void;
}

export const QuickChat: FC<Props> = ({ className, sendMessage }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div
      className={clsx(
        "z-[99999999] h-12 w-12 cursor-pointer rounded-full bg-white p-2 hover:bg-gray-100",
        className
      )}
      onClick={() => setOpen(!open)}
    >
      <Image src={chat} alt="" />
      <div
        className={clsx(
          "absolute bottom-12 z-[9999] w-max rounded-lg bg-white",
          !open && "hidden"
        )}
      >
        {Object.values(GameChatMessages).map((message, index) => (
          <div
            onClick={() => sendMessage(message)}
            className={clsx(
              "cursor-pointer px-5 py-2 text-lg",
              index % 2 !== 0 ? "bg-white" : "bg-gray-200",
              index === 0
                ? "rounded-t-lg"
                : index === Object.values(GameChatMessages).length - 1
                ? "rounded-b-lg"
                : ""
            )}
            key={index}
          >
            {message}
          </div>
        ))}
      </div>
    </div>
  );
};
