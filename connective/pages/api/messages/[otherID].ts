import { withIronSession } from "next-iron-session";
import { DAO } from "../../../lib/dao";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  IApiResponseError,
  MessagesApiResponse,
} from "../../../types/apiResponseTypes";
import {ActivityFeed} from '../../../services/activity/activityFeed';

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { otherID } = req.query;
  try {
    // @ts-ignore
    let user = req.session.get().user;
    if (typeof user == "undefined") {
      return res
        .status(500)
        .json({ success: false, error: "Not signed in" } as IApiResponseError);
    }
    if (req.method == "GET") {
      var messages = await DAO.Messages.getByOtherUser(
        user.id,
        Number(otherID)
      );
      messages = messages.sort((a, b) => {
        return a.id - b.id;
      });
      res.status(200).json({ messages } as MessagesApiResponse.IGetOtherID);
    }
    if (req.method == "POST") {
      const { text } = req.body;
      await ActivityFeed.Messages.handleMessage(user.id, otherID.toString(), text);
      let insertId = await DAO.Messages.add(user.id, Number(otherID), text);
      res.status(200).json({ insertId } as MessagesApiResponse.IPostOtherID);
    }
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, error: e } as IApiResponseError);
  }
}

export default withIronSession(handler, {
  password: process.env.APPLICATION_SECRET,
  cookieName: "Connective",
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: 'none',
  },
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};
