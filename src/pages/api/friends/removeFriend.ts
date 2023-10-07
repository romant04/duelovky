import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../../supabase";

export default async function signIn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;

  try {
    const { error } = await supabase
      .from("friends")
      .delete()
      .in("user1_id", [body.sender_id, body.receiver_id])
      .in("user2_id", [body.sender_id, body.receiver_id]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: "Successfully removed friend" });
  } catch (e) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
