import { FC, ReactElement, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { navbarDialogClose } from "@/store/navbar-dialog/navbar-dialog-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

interface Props {
  text: string;
  link: string;
  children?: ReactElement[] | ReactElement;
}

export const NavbarLink: FC<Props> = ({ text, link, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  return (
    <>
      {children ? (
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="relative after:absolute after:-bottom-[-2px] after:left-0 after:h-[1px] after:w-0 after:bg-lime-600 after:transition-all after:duration-150 after:ease-in after:content-[''] hover:after:w-[115%]">
            {text}
            {isOpen && (
              <div className="absolute right-1/2 top-8 flex w-56 translate-x-1/2 items-center justify-center bg-gray-600 text-sm md:left-0 md:translate-x-0">
                {children}
              </div>
            )}
          </div>
          <FontAwesomeIcon
            size="sm"
            icon={isOpen ? faChevronDown : faChevronUp}
          />
        </div>
      ) : (
        <Link
          onClick={() => dispatch(navbarDialogClose())}
          href={link}
          className="relative after:absolute after:-bottom-[-2px] after:left-0 after:h-[1px] after:w-0 after:bg-lime-600 after:transition-all after:duration-150 after:ease-in after:content-[''] hover:after:w-[115%]"
        >
          {text}
        </Link>
      )}
    </>
  );
};
