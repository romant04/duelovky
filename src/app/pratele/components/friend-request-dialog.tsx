import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";
import { clsx } from "clsx";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  username?: string;
  friend_id?: number;
  my_id?: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const FriendRequestDialog: FC<Props> = ({
  username,
  my_id,
  friend_id,
  isOpen,
  setIsOpen,
}) => {
  const [message, setMessage] = useState("");

  const updateMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 500) return;

    setMessage(e.target.value);
  };

  const sendFriendRequest = async () => {
    const friendRequestData: FriendRequestData = {
      sender_id: my_id as number,
      receiver_id: friend_id as number,
      message: message,
    };

    const res = await fetch("/api/friends/sendFriendRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(friendRequestData),
    });

    if (!res.ok) {
      toast.error("Tomuto uživateli jste již žádost zaslali");
      setMessage("");
      setIsOpen(false);
      return;
    }

    toast.success("Žádost o přátelství úspěšně zaslána");
    setMessage("");
    setIsOpen(false);
  };

  return (
    <div
      className={clsx(
        "fixed left-0 top-0 flex items-center justify-center bg-black/50",
        isOpen
          ? "pointer-events-auto h-screen w-screen opacity-100"
          : "pointer-events-none h-0 w-0 opacity-0"
      )}
    >
      <div className="w-2/5 bg-gray-800 text-white">
        <div className="flex justify-between bg-lime-700 px-4 py-2">
          <h2 className="text-lg">
            Žádost uživateli <span className="font-semibold">{username}</span>
          </h2>
          <button onClick={() => setIsOpen(false)}>X</button>
        </div>
        <div className="p-4">
          <p>Zpráva (max. 500 znaků): </p>
          <textarea
            value={message}
            className="w-full resize-none p-2 text-white"
            rows={5}
            onChange={updateMessage}
          />
          <button
            className="float-right my-4 bg-lime-700 px-2 py-1 hover:bg-lime-600"
            onClick={sendFriendRequest}
          >
            Poslat žádost
          </button>
        </div>
      </div>
    </div>
  );
};
