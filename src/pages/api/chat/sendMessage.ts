import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../../supabase";

export default async function signIn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;

  try {
    const { error } = await supabase.from("chat").insert({
      sender_id: Number(body.id),
      receiver_id: Number(body.receiver_id),
      message: body.message,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: "Successfully sent message" });
  } catch (e) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
