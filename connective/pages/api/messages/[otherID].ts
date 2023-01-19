import { withIronSession } from "next-iron-session";
import { DAO } from "../../../lib/dao";
import type { NextApiRequest, NextApiResponse } from "next";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { otherID } = req.query;
  try {
    // @ts-ignore
    let user = req.session.get().user;
    if (typeof user == "undefined") {
      return res.status(500).json({ success: false, error: "Not signed in" });
    }
    if (req.method == "GET") {
      var messages = await DAO.Messages.getByOtherUser(
        user.id,
        Number(otherID)
      );
      messages = messages.sort((a, b) => {
        return parseInt(a.id) - parseInt(b.id);
      });
      res.status(200).json(messages);
    }
    if (req.method == "POST") {
      const { text } = req.body;
      let insertId = await DAO.Messages.add(user.id, Number(otherID), text);
      res.status(200).json(insertId);
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, error: e });
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
