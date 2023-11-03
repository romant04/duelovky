"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useState } from "react";
import { SupabaseUser } from "@/types/auth";
import { AddFriendsForm } from "./components/add-friends-form";
import { FriendTab } from "@/app/main/pratele/components/friend-tab";
import { FriendRequestDialog } from "@/app/main/pratele/components/friend-request-dialog";
import { FriendRequestTab } from "@/app/main/pratele/components/friend-request-tab";
import useSWR from "swr";
import { LoadingSpinnerGreen } from "@/app/components/loading-spinner-green";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {
  const [activeUser, setActiveUser] = useState<SupabaseUser>();
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const {
    data: friends,
    mutate,
    isLoading,
  } = useSWR<SupabaseUser[]>(
    `/api/friends/getFriends?token=${user?.id}`,
    fetcher
  );
  const {
    data: friendRequest,
    mutate: requestsMutate,
    isLoading: requestsLoading,
  } = useSWR<RecievedFriendRequestData[]>(
    `/api/friends/getFriendRequests?id=${user?.id}`,
    fetcher
  );

  const sendFriendRequest = (supposedFriend: SupabaseUser) => {
    setActiveUser(supposedFriend);
    setIsOpen(true);
  };

  const friendsEmails =
    friends !== undefined && friends.length >= 0
      ? friends.map((x) => x.email)
      : [];

  return (
    <>
      <FriendRequestDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        friend_id={activeUser?.id}
        my_id={user?.id}
        username={activeUser?.username}
      />
      {user ? (
        <div className="flex flex-col items-center justify-around gap-5 px-2 md:flex-row md:items-start">
          <AddFriendsForm
            me_email={user.email}
            sendFriendRequest={sendFriendRequest}
            friends_emails={friendsEmails}
          />
          <div className="flex flex-col justify-between gap-10 px-2">
            <div>
              <h1 className="mb-2 text-start text-2xl font-light text-lime-600">
                Moji přátelé
              </h1>
              {requestsLoading ? (
                <LoadingSpinnerGreen />
              ) : friends && friends?.length > 0 ? (
                <div>
                  {friends.map((friend: SupabaseUser) => (
                    <FriendTab
                      user={friend}
                      key={friend.uid}
                      my_id={user.id}
                      friend_mutate={mutate}
                    />
                  ))}
                </div>
              ) : (
                <p>Zatím nemáš žádné přátele</p>
              )}
            </div>
            <div>
              <h1 className="mb-2 text-start text-2xl font-light text-lime-600">
                Žádosti o přátelství
              </h1>
              {isLoading ? (
                <LoadingSpinnerGreen />
              ) : friendRequest && friendRequest?.length > 0 ? (
                <div className="flex max-h-96 flex-col overflow-auto px-2">
                  {friendRequest.map((request) => (
                    <>
                      <FriendRequestTab
                        username={request.users.username}
                        sender_id={request.users.id}
                        key={request.users.id}
                        message={request.message}
                        my_id={user.id}
                        mutateFriends={mutate}
                        mutateRequest={requestsMutate}
                      />
                    </>
                  ))}
                </div>
              ) : (
                <p>Zatím nemáš žádné žádosti o přátelství</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-center text-3xl font-light text-red-600">
            Nejsi přihlášen, pro přidávání přátel se nejprve přihlaš
          </h1>
        </div>
      )}
    </>
  );
}
