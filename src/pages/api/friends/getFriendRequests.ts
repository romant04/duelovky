import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../../supabase";

export default async function signIn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  try {
    const { data, error } = await supabase
      .from("friend_request")
      .select(
        `
        users!sender_id (id, username),
        message
    `
      )
      .eq("receiver_id", Number(id));

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (e) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
