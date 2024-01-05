import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";

export default async function slovniFotbal(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { word } = req.query;

  try {
    const file = await fs.readFile("./slovnik.txt", "utf8");
    const data = file.split("\r\n").filter((slovo) => slovo == word).length > 0;
    return res.status(200).json(data);
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
}
