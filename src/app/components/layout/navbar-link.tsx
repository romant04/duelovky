import { FC } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { navbarDialogClose } from "@/store/navbar-dialog/navbar-dialog-slice";

interface Props {
  text: string;
  link: string;
}

export const NavbarLink: FC<Props> = ({ text, link }) => {
  const dispatch = useDispatch();

  return (
    <Link
      onClick={() => dispatch(navbarDialogClose())}
      href={link}
      className="relative after:absolute after:-bottom-[-2px] after:left-0 after:h-[1px] after:w-0 after:bg-lime-600 after:transition-all after:duration-150 after:ease-in after:content-[''] hover:after:w-[115%]"
    >
      {text}
    </Link>
  );
};
