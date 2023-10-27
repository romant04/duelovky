import { FC } from "react";
import { selectChat } from "@/store/chat/chat-slice";
import { useDispatch } from "react-redux";

interface Props {
  id: number;
  name: string;
}

export const FriendTab: FC<Props> = ({ id, name }) => {
  const dispatch = useDispatch();

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
      className="flex cursor-pointer items-center justify-between gap-8 bg-gray-750 p-4 hover:bg-gray-700"
      onClick={handleChatSelect}
    >
      <div className="flex items-center gap-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-500">
          {name.charAt(0).toUpperCase()}
        </div>
        <p>{name}</p>
      </div>
    </div>
  );
};
