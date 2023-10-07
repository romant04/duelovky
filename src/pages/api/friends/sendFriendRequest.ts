import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../../supabase";

export default async function signIn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;

  try {
    const { error } = await supabase.from("friend_request").insert({
      sender_id: body.sender_id,
      receiver_id: body.receiver_id,
      message: body.message,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res
      .status(200)
      .json({ success: "Successfully send friend request" });
  } catch (e) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
