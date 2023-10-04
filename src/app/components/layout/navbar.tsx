"use client";

import { FC } from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useMediaQuery } from "@/utils/useMediaQuery";
import { ThemeSwitcher } from "@/app/components/layout/theme-switcher";
import { NavbarUser } from "@/app/components/layout/navbar-user";
import { NavbarLink } from "@/app/components/layout/navbar-link";
import { NavbarDialog } from "@/app/components/layout/navbar-dialog";
import { navbarDialogOpen } from "@/store/navbar-dialog/navbar-dialog-slice";

export const Navbar: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);

  const mdUp = useMediaQuery("(min-width: 800px)");

  return (
    <>
      <NavbarDialog user={user.user} />

      {mdUp ? (
        <div className="flex items-center justify-between px-12 py-6">
          <h1 className="text-4xl font-light text-gray-800 dark:text-gray-200">
            Duelovky
          </h1>
          <div className="flex gap-16 text-lg">
            <NavbarLink text="Hry" link="/" />
            <NavbarLink text="Žebříček" link="/zebricek" />
            <NavbarLink text="Podpora" link="/podpora" />
          </div>
          <div className="flex items-center gap-5">
            <ThemeSwitcher />
            <NavbarUser user={user.user} />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-6 py-6">
          <h1 className="text-3xl font-light text-gray-800 dark:text-gray-200">
            Duelovky
          </h1>
          <div className="flex items-center">
            <ThemeSwitcher />
            <button
              className="text-lime-600 hover:text-lime-700"
              onClick={() => dispatch(navbarDialogOpen())}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
