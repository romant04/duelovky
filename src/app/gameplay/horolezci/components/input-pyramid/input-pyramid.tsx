import { FC } from "react";
import styles from "./pyramid-grid.module.css";
import { HorolezciPyramidChars } from "@/types/horolezci";
import { InputField } from "./input-field";
import { Socket } from "socket.io-client";

interface Props {
  chars?: HorolezciPyramidChars;
  socket: Socket;
}

export const InputPyramid: FC<Props> = ({ chars, socket }) => {
  return (
    <div className="absolute z-[99999] flex h-full w-full items-center justify-center pb-64">
      <div className="flex flex-col items-center">
        <div className={styles.hexRow}>
          <InputField char={chars?.level1} level={4} socket={socket} />
        </div>
        <div className={styles.hexRow}>
          {chars?.level2.map((char, index) => (
            <InputField char={char} key={index} level={3} socket={socket} />
          ))}
        </div>
        <div className={styles.hexRow}>
          {chars?.level3.map((char, index) => (
            <InputField char={char} key={index} level={2} socket={socket} />
          ))}
        </div>
        <div className={styles.hexRow}>
          {chars?.level4.map((char, index) => (
            <InputField char={char} key={index} level={1} socket={socket} />
          ))}
        </div>
      </div>
    </div>
  );
};
