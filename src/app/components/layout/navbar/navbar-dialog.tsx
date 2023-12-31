import { FC } from "react";
import { clsx } from "clsx";
import { NavbarUser } from "@/app/components/layout/navbar/navbar-user";
import { NavbarLink } from "@/app/components/layout/navbar/navbar-link";
import { SupabaseUser } from "@/types/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { navbarDialogClose } from "@/store/navbar-dialog/navbar-dialog-slice";
import { InnerLink } from "@/app/components/layout/navbar/inner-link";

interface Props {
  user: SupabaseUser | null;
}

export const NavbarDialog: FC<Props> = ({ user }) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((store: RootState) => store.navbarDialog.isOpen);

  return (
    <div
      className={clsx(
        isOpen ? "h-full" : "h-0",
        "fixed left-0 top-0 z-[9999] flex w-full flex-col items-center justify-center bg-gray-750 text-white shadow-2xl transition-[height] duration-300 ease-in"
      )}
    >
      <div
        className={clsx(
          isOpen
            ? "pointer-events-auto opacity-100 delay-150 duration-300"
            : "pointer-events-none opacity-0 duration-300",
          "flex flex-col gap-24 transition-[opacity] ease-in"
        )}
      >
        <div className="absolute left-0 top-0 flex w-full justify-between p-5">
          <h1 className="text-3xl text-lime-600">Duelovky</h1>
          <button
            className="text-xl text-lime-600 hover:text-lime-700"
            onClick={() => dispatch(navbarDialogClose())}
          >
            x
          </button>
        </div>

        <div className="flex flex-col items-center gap-16 text-lg">
          <NavbarLink text="Hry" link="/" />
          <NavbarLink text="Žebříček" link="/zebricek" />
          <NavbarLink text="Přátelé" link="/pratele">
            <div className="flex w-full flex-col gap-2 p-2">
              <InnerLink text="Moji kamarádi" link="/pratele" />
              <InnerLink text="Chat" link="/chat" />
            </div>
          </NavbarLink>
        </div>
        <NavbarUser user={user} />
      </div>
    </div>
  );
};
