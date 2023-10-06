import { NextApiRequest, NextApiResponse } from "next";
import { SupabaseUser } from "@/types/auth";
import { supabase } from "../../../../supabase";

export default async function tokenCheck(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.query;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("uid", token as string)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (data) {
      return res.status(200).json(data as SupabaseUser);
    } else {
      return res.status(400).json({ error: "No account found" });
    }
  } catch (e) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
