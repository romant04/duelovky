"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { SupabaseUser } from "@/types/auth";

export default function Page() {
  const [friends, setFriends] = useState<SupabaseUser[]>();
  const user = useSelector((state: RootState) => state.user.user);

  const fetchFriends = async () => {
    const res = await fetch(`/api/friends/getFriends?token=${user?.id}`);
    const myFriends = (await res.json()) as SupabaseUser[];
    setFriends(myFriends);
  };

  useEffect(() => {
    if (user) {
      void fetchFriends();
    }
  }, [user]);

  return (
    <>
      {user ? (
        <div>
          <h1>{user.username}</h1>
        </div>
      ) : (
        <div>
          <h1>Not logged in</h1>
        </div>
      )}
    </>
  );
}
