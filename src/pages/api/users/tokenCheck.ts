import { NextApiRequest, NextApiResponse } from "next";
import { SupabaseUser } from "@/types/auth";
import { supabase } from "../../../../supabase";
import jwt from "jsonwebtoken";

export default async function tokenCheck(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    );

    if (!decoded) {
      return res.status(400).json({ error: "wrong token" });
    }

    // @ts-ignore
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return res.status(400).json({ error: "Expired token" });
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      // @ts-ignore
      .eq("id", decoded.userId)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (data) {
      const sendData: SupabaseUser = { ...data, uid: token as string };
      return res.status(200).json(sendData as SupabaseUser);
    } else {
      return res.status(400).json({ error: "No account found" });
    }
  } catch (e) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
