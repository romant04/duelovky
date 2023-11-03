import { FC } from "react";

export enum tags {
  "logicke" = "logické",
  "vedomostni" = "vědomostní",
  "karetni" = "karetní",
  "slovni" = "slovní",
}

const tagsData = [
  {
    tag: tags.logicke,
    color: "#e7da2b",
  },
  {
    tag: tags.vedomostni,
    color: "#42de0e",
  },
  {
    tag: tags.karetni,
    color: "#ff4700",
  },
  {
    tag: tags.slovni,
    color: "#4885ff",
  },
];

interface Props {
  tag: tags;
}

export const GameTag: FC<Props> = ({ tag }) => {
  const color = tagsData.find((x) => x.tag === tag)?.color;
  return (
    <span style={{ color: color }} className="font-light">
      #{tag}
    </span>
  );
};
