import { FC } from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const NavbarLink = ({ text }: { text: string }) => (
  <Link
    href="#"
    className="relative after:absolute after:-bottom-[-2px] after:left-0 after:h-[1px] after:w-0 after:bg-lime-600 after:transition-all after:duration-150 after:ease-in after:content-[''] hover:after:w-[115%]"
  >
    {text}
  </Link>
);

export const Navbar: FC = () => (
  <div className="flex items-center justify-between px-12 py-6">
    <h1 className="text-4xl font-light text-gray-800">Duelovky</h1>
    <div className="flex gap-16 text-lg">
      <NavbarLink text="Hry" />
      <NavbarLink text="Žebříček" />
      <NavbarLink text="Podpora" />
    </div>
    <button className="flex items-center gap-3 font-semibold text-lime-600 hover:text-lime-700">
      <FontAwesomeIcon className="h-7" icon={faUser} /> Přihlásit
    </button>
  </div>
);
