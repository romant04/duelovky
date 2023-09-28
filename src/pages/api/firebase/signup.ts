import { addDoc, collection } from "@firebase/firestore";
import { db } from "@/pages/api/firebase/config";
import * as bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { SigninApiResponse } from "@/types/auth";

export default async function signUp(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body: data } = req;

  let result = null;

  try {
    const encryptedPassword = await bcrypt.hash(data.password, 10);

    result = await addDoc(collection(db, "users"), {
      username: data.username,
      email: data.email,
      password: encryptedPassword,
    });

    const returnData: SigninApiResponse = {
      id: result.id,
      userData: { username: data.username, email: data.email },
    };

    res.status(200).json(returnData);
  } catch (e) {
    res.status(400).json({ error: "Something went wrong" });
  }
}
