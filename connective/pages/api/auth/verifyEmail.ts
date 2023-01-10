import { DAO } from "../../../lib/dao";
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: any, res: NextApiResponse) {
  try {
    const { code, email } = req.body;
    let user = await DAO.Users.getByEmail(email)

    if (user) {
      if (user.verify_email_otp === code) {
        await DAO.Users.updateVerificationStatus(true, email)
        return res.status(201).json(true);
      } else {
        res
          .status(200)
          .json({ success: false, error: "Incorrect verification code" });
      }
    } else {
      res.status(200).json({ success: false, error: "User not found" });
    }
  } catch (e) {
    console.log(e);
    return res.status(200).json({ success: false, error: e });
  }
}
