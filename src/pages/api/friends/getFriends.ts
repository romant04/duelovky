import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../../supabase";

export default async function signIn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.query;
  const id = Number(token);

  try {
    const { data, error } = await supabase
      .from("friends")
      .select()
      .or(`user1_id.eq.${id},user2_id.eq.${id}`);

    if (data?.length === 0) {
      return res.status(400).json({ error: "No friends found" });
    }

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const friendIds = data?.map((dato) => {
      return dato.user1_id != id ? dato.user1_id : dato.user2_id;
    });
    const { data: friends, error: friendError } = await supabase
      .from("users")
      .select()
      .in("id", friendIds as number[]);

    if (friendError) {
      return res.status(400).json({ error: friendError.message });
    }

    return res.status(200).json(friends);
  } catch (e) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
