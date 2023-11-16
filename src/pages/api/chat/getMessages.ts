import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../../supabase";

export default async function signIn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, friend_id } = req.query;

  try {
    const { data, error } = await supabase
      .from("chat")
      .select()
      .in("sender_id", [id, friend_id])
      .in("receiver_id", [id, friend_id]);

    if (error) {
      return res.status(400).json({ error: error });
    }

    return res.status(200).json(data);
  } catch (e) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
