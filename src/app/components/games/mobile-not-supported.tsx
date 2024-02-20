import { FC } from "react";

export const MobileNotSupported: FC = () => {
  return (
    <div className="bg-red-600 p-5 md:hidden">
      <h1>Tato hra není podporována pro mobilní zařízení</h1>
    </div>
  );
};
