import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../../supabase";
import jwt from "jsonwebtoken";
import { SupabaseUser } from "@/types/auth";

export default async function updatePoints(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;

  try {
    const decoded = jwt.verify(
      body.token as string,
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
      const sendData: SupabaseUser = { ...data, uid: body.token as string };

      const { error: error2 } = await supabase
        .from("users")
        .update({
          prsi_mmr: body.win ? sendData.prsi_mmr + 10 : sendData.prsi_mmr - 10,
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
