import { FC, useEffect, useState } from "react";
import { SupabaseUser } from "@/types/auth";

interface Props {
  me_email: string;
  sendFriendRequest: (supposedFriend: SupabaseUser) => void;
  friends_emails?: string[];
}

export const AddFriendsForm: FC<Props> = ({
  me_email,
  sendFriendRequest,
  friends_emails,
}) => {
  const [users, setUsers] = useState<SupabaseUser[]>();
  const [filteredUsers, setFilteredUsers] = useState<SupabaseUser[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const [searched, setSearched] = useState("");

  const getUsers = async () => {
    const res = await fetch("/api/users/getUsers");
    if (!res.ok) return;
    const data = await res.json();
    setUsers(data);
    setFilteredUsers(data);
  };

  const search = () => {
    setFilteredUsers(
      (prev) =>
        prev?.filter((x) =>
          x.username.toUpperCase().includes(searchTerm.toUpperCase())
        )
    );
    setSearchTerm("");
    setSearched(searchTerm);
  };

  const reset = () => {
    setFilteredUsers(users);
    setSearched("");
  };

  useEffect(() => {
    void getUsers();
  }, []);

  const reducedFilteredUsers = filteredUsers?.filter(
    (x) => x.email != me_email && !friends_emails?.includes(x.email)
  );

  return (
    <div className="w-full max-w-2xl rounded-sm bg-gray-200 dark:bg-gray-750">
      <div className="bg-lime-600 p-2 dark:bg-lime-700">
        <h2 className="text-xl">Přidat přítele</h2>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4">
          <h4 className="text-lg">Hledat:</h4>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-2/5 rounded-sm border-[1px] border-gray-900 p-2 font-semibold text-black dark:bg-gray-300"
            type="text"
          />
          <button
            className="bg-lime-600 p-2 hover:bg-lime-700 dark:bg-lime-700 dark:hover:bg-lime-600"
            onClick={search}
          >
            Vyhledat
          </button>
          <button
            className="bg-red-600 p-2 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            onClick={reset}
          >
            Reset
          </button>
        </div>
        {searched && filteredUsers && (
          <p className="mt-2">
            Hledání pro:{" "}
            <span className="text-lime-600 dark:font-light dark:text-lime-500">
              {searched}
            </span>{" "}
            - {filteredUsers?.length}{" "}
            {filteredUsers.length === 0
              ? "výsledků"
              : filteredUsers.length === 1
              ? "výsledek"
              : filteredUsers?.length <= 4
              ? "výsledky"
              : "výsledků"}
          </p>
        )}
        <div className="mt-8 flex flex-col gap-3">
          {filteredUsers
            ?.filter(
              (x) => x.email != me_email && !friends_emails?.includes(x.email)
            )
            .map((user) => (
              <div
                className="flex items-center justify-between bg-gray-300 px-4 py-2 dark:bg-gray-600"
                key={user.uid}
              >
                <div className="flex items-center gap-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-500">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <p>{user.username}</p>
                </div>
                <button
                  className="justify-self-end bg-lime-600 px-3 py-1 hover:bg-lime-700 dark:bg-lime-700 dark:hover:bg-lime-600"
                  onClick={() => sendFriendRequest(user)}
                >
                  Poslat žádost
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
