import { doc, getDoc } from "@firebase/firestore";
import { db } from "@/pages/api/firebase/config";
import { NextApiRequest, NextApiResponse } from "next";
import { SigninApiResponse } from "@/types/auth";

export default async function tokenCheck(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.query;

  try {
    const record = await getDoc(doc(db, "users", token as string));
    if (record.exists()) {
      const data = record.data();
      const id = record.id;
      const returnData: SigninApiResponse = {
        id: id,
        userData: { email: data.email, username: data.username },
      };

      return res.status(200).json(returnData);
    } else {
      return res.status(400).json({ error: "No account found" });
    }
  } catch (e) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
