import { FC, useEffect } from "react";
import styles from "./pyramid-grid.module.css";
import { clsx } from "clsx";
import { Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
  selectChar,
  setHorolezciStart,
} from "@/store/horolezci/horolezci-slice";
import { RootState } from "@/store/store";

interface Props {
  char?: string;
  socket: Socket;
  level: number;
}

export const InputField: FC<Props> = ({ char, socket, level }) => {
  const dispatch = useDispatch();
  const { started, char: selectedChar } = useSelector(
    (state: RootState) => state.horolezci
  );
  const selected = started && char === selectedChar;

  const handleSelect = () => {
    dispatch(setHorolezciStart(true));
    dispatch(selectChar(char as string));
  };

  useEffect(() => {
    if (selected) {
      socket.emit("level", level);
      socket.emit("char", selected ? char : "");
    }
  }, [selected]);

  return (
    <div
      className={clsx(styles.hex, !selected && started && "opacity-70")}
      onClick={handleSelect}
    >
      <div className={styles.top}></div>
      <div
        className={clsx(
          styles.middle,
          "flex items-center justify-center text-2xl font-bold"
        )}
      >
        {char?.toUpperCase()}
      </div>
      <div className={styles.bottom}></div>
    </div>
  );
};
