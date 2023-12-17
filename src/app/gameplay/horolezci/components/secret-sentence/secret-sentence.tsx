import { FC } from "react";
import { SecretField } from "@/app/gameplay/horolezci/components/secret-sentence/secret-field";

interface Props {
  secret: string[];
}

export const SecretSentence: FC<Props> = ({ secret }) => {
  const words = secret.join("").split(" ");

  return (
    <div className="m-auto flex max-w-[70%] flex-wrap items-center justify-center gap-x-5 gap-y-2">
      {words.map((word, i) => (
        <div key={i} className="flex gap-1">
          {word.split("").map((char, i) => (
            <SecretField key={i} character={char} />
          ))}
        </div>
      ))}
    </div>
  );
};
