import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../../supabase";
import * as bcrypt from "bcrypt";
import { SupabaseUser } from "@/types/auth";
import jwt from "jsonwebtoken";

export default async function signIn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", body.email)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data) {
      return res.status(400).json({ error: "No match in db" });
    }

    const passwordMatch = await bcrypt.compare(
      body.password,
      data.password as string
    );

    const jwtToken = jwt.sign(
      { userId: data.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "2 days",
      }
    );

    const sendData: SupabaseUser = { ...data, uid: jwtToken as string };

    if (passwordMatch) {
      return res.status(200).json(sendData as SupabaseUser);
    }

    return res.status(400).json({ error: "Wrong password" });
  } catch (e) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
