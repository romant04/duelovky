"use client";

import { FC } from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { clearUser } from "@/store/users/user-slice";
import { useMediaQuery } from "@/utils/useMediaQuery";
import { ThemeSwitcher } from "@/app/components/layout/theme-switcher";

const NavbarLink = ({ text }: { text: string }) => (
  <Link
    href="#"
    className="relative after:absolute after:-bottom-[-2px] after:left-0 after:h-[1px] after:w-0 after:bg-lime-600 after:transition-all after:duration-150 after:ease-in after:content-[''] hover:after:w-[115%]"
  >
    {text}
  </Link>
);

export const Navbar: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);

  const logout = () => {
    localStorage.setItem("token", "");
    dispatch(clearUser());
  };

  const mdUp = useMediaQuery("(min-width: 800px)");

  return (
    <>
      {mdUp ? (
        <div className="flex items-center justify-between px-12 py-6">
          <h1 className="text-4xl font-light text-gray-800 dark:text-gray-200">
            Duelovky
          </h1>
          <div className="flex gap-16 text-lg">
            <NavbarLink text="Hry" />
            <NavbarLink text="Žebříček" />
            <NavbarLink text="Podpora" />
          </div>
          <div className="flex items-center gap-5">
            <ThemeSwitcher />
            {user?.user ? (
              <div className="flex items-center gap-5">
                <p>{user.user.username}</p>
                <button
                  onClick={logout}
                  className="rounded-sm bg-lime-600 px-3 py-2 text-white hover:bg-lime-700"
                >
                  Odhlásit se
                </button>
              </div>
            ) : (
              <Link href="/prihlaseni">
                <button className="flex items-center gap-3 font-semibold text-lime-600 hover:text-lime-700">
                  <FontAwesomeIcon className="h-7" icon={faUser} /> Přihlásit
                </button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-6 py-6">
          <h1 className="text-3xl font-light text-gray-800 dark:text-gray-200">
            Duelovky
          </h1>
          <div className="flex">
            <ThemeSwitcher />
            {user?.user ? (
              <div className="flex items-center gap-5">
                <p>{user.user.username}</p>
                <button
                  onClick={logout}
                  className="rounded-sm bg-lime-600 px-3 py-2 text-white hover:bg-lime-700"
                >
                  Odhlásit se
                </button>
              </div>
            ) : (
              <Link href="/prihlaseni">
                <button className="flex items-center gap-3 font-semibold text-lime-600 hover:text-lime-700">
                  <FontAwesomeIcon className="h-7" icon={faUser} /> Přihlásit
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};
