import { NextApiRequest, NextApiResponse } from "next";

export default async function slovniFotbal(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { word } = req.query;

  try {
    const vocab = await fetch(
      "https://naasqncfyegievluczok.supabase.co/storage/v1/object/public/slovnik/slovnik.txt"
    );
    const data = await vocab.text();
    const isIn = data.split("\r\n").filter((w) => w === word).length > 0;

    return res.status(200).json(isIn);
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
}
