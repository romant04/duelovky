import { FC } from "react";
import { clsx } from "clsx";

interface Props {
  sender: string;
  message: string;
}

export const ChatBubble: FC<Props> = ({ sender, message }) => {
  const myMessage = sender === "Já";

  return (
    <div
      className={clsx(
        myMessage ? "self-end bg-gray-200" : "self-start bg-lime-300",
        "flex w-max max-w-[280px] flex-col gap-1 rounded-xl px-2 py-1 text-black"
      )}
    >
      <p
        className={clsx(
          "text-xs text-gray-700",
          myMessage ? "self-end" : "self-start"
        )}
      >
        {sender}
      </p>
      <p className={clsx(myMessage ? "pl-2 pr-1" : "pl-1 pr-2", "text-left")}>
        {message}
      </p>
    </div>
  );
};
