import { FC } from "react";
import Link from "next/link";
import { navbarDialogClose } from "@/store/navbar-dialog/navbar-dialog-slice";
import { useDispatch } from "react-redux";

interface Props {
  link: string;
  text: string;
}

export const InnerLink: FC<Props> = ({ link, text }) => {
  const dispatch = useDispatch();

  return (
    <Link
      onClick={() => dispatch(navbarDialogClose())}
      href={link}
      className="relative w-full p-2 hover:bg-gray-500"
    >
      {text}
    </Link>
  );
};
