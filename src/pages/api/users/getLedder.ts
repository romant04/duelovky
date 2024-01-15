import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../../supabase";

export default async function signIn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data, error } = await supabase.from("users").select(`
    username,
    prsi_mmr,
    horolezci_mmr,
    fotbal_mmr
  `);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (e) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
