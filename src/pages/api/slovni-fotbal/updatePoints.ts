import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../../supabase";

export default async function updatePoints(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      // @ts-ignore
      .eq("username", body.username)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (data) {
      const sendData = { ...data };

      const { error: error2 } = await supabase
        .from("users")
        .update({
          fotbal_mmr: body.win
            ? sendData.fotbal_mmr + 10
            : sendData.fotbal_mmr - 10,
        })
        .eq("id", sendData.id)
        .single();

      if (error2) {
        return res.status(400).json({ error: error2.message });
      }

      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ error: "No account found" });
    }
  } catch (e) {
    return res.status(400).json({ error: e });
  }
}
