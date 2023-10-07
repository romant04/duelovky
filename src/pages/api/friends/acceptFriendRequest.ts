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
      .insert({ user1_id: body.sender_id, user2_id: body.receiver_id });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { error: error2 } = await supabase
      .from("friend_request")
      .delete()
      .eq("sender_id", body.sender_id)
      .eq("receiver_id", body.receiver_id);

    if (error2) {
      return res.status(400).json({ error: error2.message });
    }

    return res.status(200).json("Friends request accepted");
  } catch (e) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
