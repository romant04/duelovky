"use client";

import { FC, useEffect } from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useMediaQuery } from "@/utils/useMediaQuery";
import { NavbarUser } from "@/app/components/layout/navbar/navbar-user";
import { NavbarLink } from "@/app/components/layout/navbar/navbar-link";
import { NavbarDialog } from "@/app/components/layout/navbar/navbar-dialog";
import { navbarDialogOpen } from "@/store/navbar-dialog/navbar-dialog-slice";
import { SupabaseUser } from "@/types/auth";
import { setUser } from "@/store/users/user-slice";
import { InnerLink } from "@/app/components/layout/navbar/inner-link";
import { getCookie } from "cookies-next";

export const Navbar: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);

  const auth = async (token: string) => {
    const res = await fetch(`/api/users/tokenCheck?token=${token}`);
    if (!res.ok) return;

    const data = (await res.json()) as SupabaseUser;
    if (data.uid !== token) return;
    dispatch(setUser(data));
  };

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      void auth(token);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mdUp = useMediaQuery("(min-width: 960px)");

  return (
    <>
      <NavbarDialog user={user.user} />

      {mdUp ? (
        <div className="flex items-center justify-between px-12 py-6">
          <h1 className="text-4xl font-light text-gray-200">Duelovky</h1>
          <div className="flex gap-16 text-lg">
            <NavbarLink text="Hry" link="/" />
            <NavbarLink text="Žebříček" link="/zebricek" />
            <NavbarLink text="Přátelé" link="/pratele">
              <div className="flex w-full flex-col gap-2 p-2">
                <InnerLink text="Moji kamarádi" link="/pratele" />
                <InnerLink text="Chat" link="/chat" />
              </div>
            </NavbarLink>
          </div>
          <NavbarUser user={user.user} />
        </div>
      ) : (
        <div className="flex items-center justify-between px-6 py-6">
          <h1 className="text-3xl font-light text-gray-200">Duelovky</h1>
          <div className="flex items-center">
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
