import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faXmark } from "@fortawesome/free-solid-svg-icons";
import { SupabaseUser } from "@/types/auth";
import { KeyedMutator } from "swr";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { selectChat } from "@/store/chat/chat-slice";

interface Props {
  user: SupabaseUser;
  my_id: number;
  friend_mutate: KeyedMutator<SupabaseUser[]>;
}

export const FriendTab: FC<Props> = ({ user, my_id, friend_mutate }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const removeFriend = async () => {
    const res = await fetch("/api/friends/removeFriend", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sender_id: user.id, receiver_id: my_id }),
    });

    if (!res.ok) {
      toast.error("Something went wrong");
      return;
    }

    toast.success("Successfully removed friend");

    await friend_mutate();
  };

  const handleChatRedirection = () => {
    dispatch(
      selectChat({
        id: user.id,
        friend: { id: user.id, username: user.username },
      })
    );
    router.push(`/main/chat`);
  };

  return (
    <div className="flex items-center justify-between gap-8 py-2">
      <div className="flex items-center gap-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-500">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <p>{user.username}</p>
      </div>
      <div className="flex gap-6 text-xl text-lime-500">
        <button className="hover:text-lime-600" onClick={handleChatRedirection}>
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
        <button className="hover:text-lime-600" onClick={removeFriend}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
};
