import { FC } from "react";
import { selectChat } from "@/store/chat/chat-slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { clsx } from "clsx";

interface Props {
  id: number;
  name: string;
}

export const FriendTab: FC<Props> = ({ id, name }) => {
  const dispatch = useDispatch();
  const { openedChat } = useSelector((state: RootState) => state.chatLayout);

  const handleChatSelect = () => {
    dispatch(
      selectChat({
        id: id,
        friend: { id: id, username: name },
      })
    );
  };

  return (
    <div
      className={clsx(
        openedChat?.friend.id === id
          ? "bg-lime-600"
          : "cursor-pointer bg-gray-750 hover:bg-gray-700",
        "flex items-center justify-between gap-8 p-4"
      )}
      onClick={handleChatSelect}
    >
      <div className="flex items-center gap-5">
        <div
          className={clsx(
            openedChat?.friend.id === id ? "bg-gray-750" : "bg-lime-500",
            "flex h-10 w-10 items-center justify-center rounded-full"
          )}
        >
          {name.charAt(0).toUpperCase()}
        </div>
        <p>{name}</p>
      </div>
    </div>
  );
};
