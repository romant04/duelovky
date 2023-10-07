import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { KeyedMutator } from "swr";
import { SupabaseUser } from "@/types/auth";

interface Props {
  username: string;
  sender_id: number;
  my_id: number;
  message?: string;
  mutateRequest: KeyedMutator<RecievedFriendRequestData[]>;
  mutateFriends: KeyedMutator<SupabaseUser[]>;
}

export const FriendRequestTab: FC<Props> = ({
  username,
  sender_id,
  my_id,
  message,
  mutateFriends,
  mutateRequest,
}) => {
  const data = {
    sender_id: sender_id,
    receiver_id: my_id,
  };

  const decline = async () => {
    const res = await fetch("/api/friends/deleteFriendRequest", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) return;

    await mutateRequest();
    await mutateFriends();
  };

  const accept = async () => {
    const res = await fetch("/api/friends/acceptFriendRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) return;

    await mutateRequest();
    await mutateFriends();
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-8 py-2">
        <div className="flex flex-col gap-2">
          <h4 className="text-lg">{username}</h4>
          <p className="max-w-lg text-sm">{message}</p>
        </div>
        <div className="flex gap-6 text-xl">
          <button
            className="text-lime-500 hover:text-lime-600"
            onClick={accept}
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
          <button className="text-red-500 hover:text-red-600" onClick={decline}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </div>
    </div>
  );
};
