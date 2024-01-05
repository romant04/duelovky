import Link from "next/link";

export default function Page({
  params,
}: {
  params: { win: "win" | "lose" | "draw" };
}) {
  return (
    <div className="mx-5 mt-16 flex flex-col items-center">
      {params.win === "win" ? (
        <h1 className="text-3xl text-lime-500">
          Vyhrál si, získáváš 10 bodů MMR
        </h1>
      ) : params.win === "lose" ? (
        <h1 className="text-3xl text-red-500">
          Prohrál si, ztrácíš 10 bodů MMR
        </h1>
      ) : (
        <h1 className="text-3xl text-orange-500">
          Remíza, neztrácíš ani nezískáváš žádné MMR
        </h1>
      )}
      <p className="mt-3 text-lg">
        Hraj dál a zkus se dostat až na vrchol žebříčku
      </p>
      <div className="mt-12 flex gap-10">
        <Link
          className="rounded-sm bg-lime-600 px-4 py-2 text-center text-lg hover:bg-lime-500"
          href="/"
        >
          Hlavní menu
        </Link>
        <Link
          className="rounded-sm bg-orange-600 px-4 py-2 text-center text-lg hover:bg-orange-500"
          href="/zebricek"
        >
          Žebříček
        </Link>
      </div>
    </div>
  );
}
