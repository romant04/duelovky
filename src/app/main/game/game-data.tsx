import { GameData } from "@/types/game";
import { tags } from "@/app/components/games/game-tag";
import fotbal from "@/app/assets/game_previews/fotbal.png";
import horolezci from "@/app/assets/game_previews/horolezci.png";
import prsi from "@/app/assets/game_previews/prsi.png";

const HorolezciRules = () => {
  return (
    <div className="sm:max-w-[80%] md:max-w-[70%]">
      <h3 className="mt-5 text-lg font-semibold">Cíl hry:</h3>
      <p>
        Cílem hry je pomocí hádání správných písmen tajenky se dostat až na
        vrchol hory. Vyhrává ten kdo jako první dosáhne 100 bodů, čímž se
        dostane na vrchol
      </p>
      <h3 className="mt-8 text-lg font-semibold">Ovládání:</h3>
      <p>
        Hra se ovládá velmi jednodušše pomocí klikání na pyramidu písmen, která
        se vždy objeví na obrazovce a hráč dostane 30 sekund na to si jedno z
        písmen vybrat. Vybrané písmeno bude oproti ostatním označeno, hráč může
        svou volbu změnit
      </p>
      <h3 className="mt-8 text-lg font-semibold">Bodování:</h3>
      <div className="space-y-5">
        <p>Na bodování se podílí 2 faktory.</p>
        <p>
          <span className="font-semibold">Prvním faktorem</span>, který určí
          základní body je pozice písmena v tajence. Čím výše je písmeno v
          pyramidě, tím větší bodové ohodnocení má (spodek pyramidy - 1 bod,
          vršek - 4 body). Zároveň ale platí, že čím výše je písmeno, tím je
          menší šance, že v tajence bude.
        </p>
        <p>
          <span className="font-semibold">Druhým faktorem</span> je počet
          výskytů písmena v tajence. Za každý výskyt písmena v tajence se hráči
          znovu přičte daný počet bodů. To znamená pokud vybere písmeno z druhé
          řady a v tajence bude 3x dostane celkem 6 bodů.
        </p>
      </div>
    </div>
  );
};
const PrsiRules = () => {
  return (
    <div className="sm:max-w-[80%] md:max-w-[70%]">
      <h3 className="mt-5 text-lg font-semibold">Cíl hry:</h3>
      <p>Cílem hry je zbavit se všech karet v ruce jako první</p>
      <h3 className="mt-8 text-lg font-semibold">Pravidla:</h3>
      <p>
        Hráči se střídají po kole, hraje hráč u kterého je momentálně blíž
        kulatý žeton uprostřed stolu. Hráč se pokouší vynášet karty na střed,
        může vynést kartu pokud má stejnou barvu. Existují zde vyjímky. Pokud
        protihráč vynese Eso musíte hrát také eso, pokud nemáte musíte předat
        kolo. Pokud protihráč vynese sedmu, musíte také zahrát sedmu, nebo si
        líznout 2. Každá zahraná sedma zvyšuje počet líznutí o 2. Tedy při 4
        sedmách si musíte líznout 8 karet. Efekt sedmy i esa platí jen jedno
        kolo. Další speciální kartou je měnic nebo také svršek, můžeme jej hrát
        na kterou koliv barvu a následně můžeme změnit barvu, která se na středu
        bude hrát. Momentální barva je zobrazována na středovém žetonu.
      </p>
      <h3 className="mt-8 text-lg font-semibold">Ovládání:</h3>
      <div className="space-y-5">
        <p className="mt-2">
          <span className="font-semibold">Vynášení karet</span> - karta se
          vyhazuje na střed kliknutím na příslušnou kartu v ruce
        </p>
        <p>
          <span className="font-semibold">Lízaní karet</span> - Kliknutím na
          balíček karet vpravo se lízne karta
        </p>
        <p>
          <span className="font-semibold">Předávání tahu</span> - Kliknutím na
          žeton s momentální barvou, který je vedle středové karty můžeme předat
          kolo, pokud protihráč zahraje eso
        </p>
      </div>
    </div>
  );
};
const FotbalRules = () => {
  return (
    <div className="sm:max-w-[80%] md:max-w-[70%]">
      <h3 className="mt-5 text-lg font-semibold">Cíl hry:</h3>
      <p>Cílem hry je sestavit, co nejvíce slov</p>
      <h3 className="mt-8 text-lg font-semibold">Pravidla:</h3>
      <p>
        Sestavovat slova můžete z písmen, která se nachází dole na obrazovce.
        Při kliknutí na písmeno se přesune do středu, jakmile budete se slovem,
        které skládáte uprostřed spokojeni můžete kliknout na tlačítko potvrdit.
        Tím se slovo pošle na kontrolu pokud touto kontrolou projde dostane bod
        za každé písmeno, které slovo obsahovalo. Podmínkou je, že slovo musí
        být podstatné jméno. Pokud se vám nějaké z písmen uporstřed nelíbí stačí
        na něj kliknout, tím ho vratíte zpět do původního výběru.
      </p>
      <h3 className="mt-8 text-lg font-semibold">Ovládání:</h3>
      <div className="space-y-5">
        <p className="mt-2">
          <span className="font-semibold">Přidávání písmena</span> - Kliknutím
          na písmeno ve spodním výběru
        </p>
        <p>
          <span className="font-semibold">Odebírání písmena</span> - Kliknutím
          na písmeno ve středu
        </p>
      </div>
    </div>
  );
};

export const GAME_DATA: GameData[] = [
  {
    title: "Horolezci",
    game_id: "horolezci",
    description: "Logická hra, závod mezi dvěma horolezci.",
    long_description:
      "Horolezci jsou vědomstní hra pro 2 hráče. Hráči spolu závodí, kdo se dřív dostane na vrchol hory. Při každém kole musí hádat jedno z několika písmen, které se musí vyskytovat ve větě, většinou pořekadlu nebo přísloví. Tuto větu vidí po celou dobu hry a vidí i písmena, která se do věty doplnila. Za špatnou odpověď, hráč klesá dolů",
    tags: [tags.vedomostni, tags.logicke],
    mobile: false,
    image: horolezci,
    rules: <HorolezciRules />,
  },
  {
    title: "Prší",
    game_id: "prsi",
    description: "Klasická karetní hra, kdo se dřív zbaví karet ?",
    long_description:
      "Prší je karetní hra, která se hraje s mariášovými kartami (tyto karty obsahují 4 barvy a 8 hodnot). Cílem hry je vyprázdnit svoji ruku. Kdo se první zbaví všech karet v ruce vyhrává. Každý hráč začíná se 5 kartami. Tyto karty se dají vyhazovat na střed v případě, že karta na středu má buďto stejnou hodnotu nebo barvu, pokud je na středu sedma je hráč nucen také zahrát sedmu nebo si musí líznout 2 karty za každou sedmu, která byla vyložena v řadě. Pokud nemá žádnou kartu, kterou by mohl vyložit, líže karu a hraje protivník",
    tags: [tags.karetni, tags.logicke],
    mobile: true,
    image: prsi,
    rules: <PrsiRules />,
  },
  {
    title: "Slovní fotbal",
    game_id: "fotbal",
    description: "Hra se slovy, kdo sestaví více slov ?",
    long_description:
      "Slovní fotbal je hra se slovy, jedná se o hru jeden na jednoho, kde se snažíte s náhodných písmen složit slova, za každé slovo získáváte body podle jeho veliksoti. Slova jsou kontrolovány podle speciálně upraveného slovníku, který obsahuje pouze podstatná jména v prvním pádě. Slova která v tomto slovníku nesjou, jsou neplatná. Kdo do dopršení časového limitu získá více bodů vyhrává",
    tags: [tags.vedomostni, tags.slovni],
    mobile: false,
    image: fotbal,
    rules: <FotbalRules />,
  },
];
