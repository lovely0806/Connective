import { withIronSession } from "next-iron-session";
import type { NextApiRequest, NextApiResponse } from "next";
import { DAO } from "../../../lib/dao";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // @ts-ignore
    let user = req.session.get().user;
    if (typeof user == "undefined") {
      return res.status(403).json({ success: false, error: "Not signed in" });
    }
    if (req.method == "POST") {
      const IDs = req.body.data.map((message: { id: number }) => {
        return message.id;
      });
      if (IDs.length > 0) {
        await DAO.Messages.updateReadMessage(IDs);
      }
      res.status(200).json({ success: true });
    }
  } catch (e) {
    console.log(e);
    return res.status(200).json({ success: false, error: e });
  }
}

export default withIronSession(handler, {
  password: process.env.APPLICATION_SECRET,
  cookieName: "Connective",
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};
