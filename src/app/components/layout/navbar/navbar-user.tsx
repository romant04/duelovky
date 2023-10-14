import { FC } from "react";
import { SupabaseUser } from "@/types/auth";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { clearUser } from "@/store/users/user-slice";
import { useDispatch } from "react-redux";
import { navbarDialogClose } from "@/store/navbar-dialog/navbar-dialog-slice";
import { closeChatLayout, resetChat } from "@/store/chat/chat-slice";

interface Props {
  user: SupabaseUser | null;
}

export const NavbarUser: FC<Props> = ({ user }) => {
  const dispatch = useDispatch();

  const logout = () => {
    localStorage.setItem("token", "");
    dispatch(navbarDialogClose());
    dispatch(clearUser());
    dispatch(closeChatLayout());
    dispatch(resetChat());
  };

  return (
    <>
      {user ? (
        <div className="flex items-center gap-5">
          <p>{user.username}</p>
          <button
            onClick={logout}
            className="rounded-sm bg-lime-600 px-3 py-2 text-white hover:bg-lime-700"
          >
            Odhlásit se
          </button>
        </div>
      ) : (
        <Link onClick={() => dispatch(navbarDialogClose())} href="/prihlaseni">
          <button className="flex items-center gap-3 font-semibold text-lime-600 hover:text-lime-700">
            <FontAwesomeIcon className="h-7" icon={faUser} /> Přihlásit
          </button>
        </Link>
      )}
    </>
  );
};
