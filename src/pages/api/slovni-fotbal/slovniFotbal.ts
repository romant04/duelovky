import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";

export default async function slovniFotbal(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { word } = req.query;

  try {
    const file = await fs.readFile(
      process.cwd() + "/src/app/assets/slovni-fotbal/slovnik.txt",
      "utf8"
    );
    const data = file.split("\r\n").filter((slovo) => slovo == word).length > 0;
    return res.status(200).json(data);
  } catch (e) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
