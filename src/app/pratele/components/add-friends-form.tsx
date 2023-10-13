import { FC, useEffect, useState } from "react";
import { SupabaseUser } from "@/types/auth";
import { useMediaQuery } from "@/utils/useMediaQuery";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  const mdUp = useMediaQuery("(min-width: 968px)");

  return (
    <div className="w-full max-w-2xl overflow-auto rounded-sm bg-gray-600 text-white dark:bg-gray-750">
      <div className="bg-lime-700 p-2">
        <h2 className="text-xl">Přidat přítele</h2>
      </div>
      <div className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <h4 className="text-lg">Hledat:</h4>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-sm border-[1px] border-gray-900 p-2 font-semibold text-black dark:bg-gray-300 md:w-2/5"
            type="text"
          />
          <div className="flex gap-4">
            <button
              className="bg-lime-700 p-2 hover:bg-lime-600"
              onClick={search}
            >
              Vyhledat
            </button>
            <button className="bg-red-700 p-2 hover:bg-red-600" onClick={reset}>
              Reset
            </button>
          </div>
        </div>
        {searched && reducedFilteredUsers && (
          <p className="mt-2">
            Hledání pro:{" "}
            <span className="text-lime-600 dark:font-light dark:text-lime-500">
              {searched}
            </span>{" "}
            - {reducedFilteredUsers?.length}{" "}
            {reducedFilteredUsers.length === 0
              ? "výsledků"
              : reducedFilteredUsers.length === 1
              ? "výsledek"
              : reducedFilteredUsers?.length <= 4
              ? "výsledky"
              : "výsledků"}
          </p>
        )}
        <div className="mt-8 flex flex-col gap-3">
          {reducedFilteredUsers?.map((user) => (
            <div
              className="flex items-center justify-between bg-gray-500 px-4 py-2 dark:bg-gray-600"
              key={user.uid}
            >
              <div className="flex items-center gap-2 md:gap-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-500">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <p>{user.username}</p>
              </div>
              <button
                className="justify-self-end bg-lime-600 px-3 py-1 hover:bg-lime-700 dark:bg-lime-700 dark:hover:bg-lime-600"
                onClick={() => sendFriendRequest(user)}
              >
                {mdUp ? "Poslat žádost" : <FontAwesomeIcon icon={faUserPlus} />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
