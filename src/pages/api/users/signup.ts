import * as bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../../supabase";
import { SupabaseUser } from "@/types/auth";
import jwt from "jsonwebtoken";

export default async function signUp(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;

  try {
    const encryptedPassword = await bcrypt.hash(body.password, 10);

    const { data, status, error } = await supabase
      .from("users")
      .insert([
        {
          username: body.username,
          email: body.email,
          password: encryptedPassword,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data) {
      res.status(400).json({ error: "Something went wrong" });
    }

    const jwtToken = jwt.sign(
      { userId: data.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "2 days",
      }
    );

    const sendData: SupabaseUser = { ...data, uid: jwtToken as string };

    return res.status(200).json(sendData as SupabaseUser);
  } catch (e) {
    res.status(400).json({ error: "Something went wrong" });
  }
}
