import type { NextApiRequest, NextApiResponse } from "next";
import { DAO } from "../../../lib/dao";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == "GET") {
      let users = await DAO.Discover.getAll();
      res.status(200).json(users);
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, error: e });
  }
}
