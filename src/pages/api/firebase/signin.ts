import { collection, getDocs, query, where } from "@firebase/firestore";
import { db } from "@/pages/api/firebase/config";
import * as bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { SigninApiResponse, UserFirebaseResponse } from "@/types/auth";

export default async function signIn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body: data } = req;

  try {
    const ref = collection(db, "users");
    const q = query(ref, where("email", "==", data.email));
    const record = await getDocs(q);
    let foundUser: UserFirebaseResponse =
      record.docs[0].data() as UserFirebaseResponse;
    let id = record.docs[0].id;

    if (!foundUser) {
      return res
        .status(400)
        .json({ error: "There is no account with this email" });
    }

    const passwordMatch = await bcrypt.compare(
      data.password,
      foundUser.password
    );

    if (passwordMatch) {
      const returnData: SigninApiResponse = {
        id: id,
        userData: { email: foundUser.email, username: foundUser.username },
      };
      return res.status(200).json(returnData);
    }

    return res.status(400).json({ error: "Wrong password" });
  } catch (e) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
