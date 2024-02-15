import { FC } from "react";

export const MobileNotSupported: FC = () => {
  return (
    <div className="bg-red-600 p-5 md:hidden">
      <h1>This game is not supported for mobile devices</h1>
    </div>
  );
};
