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
    long_description:
      "Prší je karetní hra, která se hraje s mariášovými kartami (tyto karty obsahují 4 barvy a 8 hodnot). Cílem hry je vyprázdnit svoji ruku. Kdo se první zbaví všech karet v ruce vyhrává. Každý hráč začíná se 4 kartami. Tyto karty se dají vyhazovat na střed v případě, že karta na středu má buďto stejnou hodnotu nebo barvu, pokud je na středu sedma je hráč nucen také zahrát sedmu nebo si musí líznout 2 karty za každou sedmu, která byla vyložena v řadě. Pokud nemá žádnou kartu, kterou by mohl vyložit, líže karu a hraje protivník",
    tags: [tags.karetni, tags.logicke],
  },
  {
    title: "Slovní fotbal",
    game_id: "fotbal",
    description: "Hra se slovy, kdo sestaví více slov ?",
    long_description:
      "Slovní fotbal je hra se slovy, jedná se o hru jeden na jednoho, kde se snažíte s náhodných písmen složit slova, za každé slovo získáváte body podle jeho veliksoti. Slova jsou kontrolovány podle slovníku. Slova která v tomto slovníku nesjou, jsou neplatná. Kdo do dopršení časového limitu získá více bodů vyhrává",
    tags: [tags.vedomostni, tags.slovni],
  },
];
