"use client";

import { FC } from "react";
import useSWR from "swr";
import { SupabaseUser } from "@/types/auth";
import { fetcher } from "@/app/providers/swr-fetcher";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { FriendTab } from "./friend-tab";
import { LoadingSpinnerGreen } from "@/app/components/loading-spinner-green";
import { useMediaQuery } from "@/utils/useMediaQuery";

export const FriendList: FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { data: friends, isLoading } = useSWR<SupabaseUser[]>(
    `/api/friends/getFriends?token=${user?.id}`,
    fetcher
  );

  const mdUp = useMediaQuery("(min-width: 968px)");

  if (!user) return;

  // It will get turned to this format by SWR if there was an error ex. no friends found for this user
  const friendsError = friends as unknown as { error: string };

  return (
    <div className="flex w-full flex-col gap-2 p-4 md:w-1/4 md:bg-gray-600 md:p-0">
      {!mdUp && <h2 className="text-2xl">S kým chceš chatovat ?</h2>}
      {isLoading ? (
        <LoadingSpinnerGreen />
      ) : friendsError.error ? (
        <p className="p-2 text-lg text-red-600">Zatím nemáš žádné kamarády</p>
      ) : (
        friends?.map((friend) => (
          <FriendTab key={friend.id} id={friend.id} name={friend.username} />
        ))
      )}
    </div>
  );
};
