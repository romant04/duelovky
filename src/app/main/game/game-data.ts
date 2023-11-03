import { GameData } from "@/types/game";
import { tags } from "@/app/components/games/game-tag";

export const GAME_DATA: GameData[] = [
  {
    title: "Horolezci",
    game_id: "horolezci",
    description: "Logická hra, závod mezi dvěma horolezci.",
    long_description:
      "Horolezci jsou vědomstní hra pro 2 hráče. Hráči spolu závodí, kdo se dřív dostane na vrchol hory. Při každém kole musí hádat jedno z několika písmen, které se musí vyskytovat ve větě, většinou pořekadlu nebo přísloví. Tuto větu vidí po celou dobu hry a vidí i písmena, která se do věty doplnila. Za špatnou odpověď, hráč klesá dolů",
    tags: [tags.vedomostni, tags.logicke],
  },
  {
    title: "Prší",
    game_id: "prsi",
    description: "Klasická karetní hra, kdo se dřív zbaví karet ?",
    long_description: "",
    tags: [tags.karetni, tags.logicke],
  },
  {
    title: "Slovní fotbal",
    game_id: "slovnifotbal",
    description: "Hra se slovy, kdo sestaví více slov ?",
    long_description: "",
    tags: [tags.vedomostni, tags.slovni],
  },
];
