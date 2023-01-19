import type { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";
import { DAO } from "../../../lib/dao";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { token, email } = req.body;

    const user = await DAO.Users.getByEmailAndVerificationId(email, token);

    if (!user || token == "") {
      return res.status(403).json({
        success: false,
        error: "The link is incorrect.",
      });
    }

    if (user) {
      if (user.verification_timestamp) {
        const diff = moment().diff(user.verification_timestamp, "minutes");

        if (diff > 15) {
          return res.status(403).json({
            success: false,
            error: "The link has expired.",
          });
        }

        res.status(200).json({ success: true });
      }
    }
  } catch (e) {
    console.log(e);
    return res.status(200).json({ success: false, error: e });
  }
}
