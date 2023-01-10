import { withIronSession } from "next-iron-session";
import type { NextApiRequest, NextApiResponse } from 'next'

function handler(req: any, res: NextApiResponse) {
  req.session.destroy();
  res.send("Logged out");
}

export default withIronSession(handler, {
  password: process.env.APPLICATION_SECRET,
  cookieName: "Connective",
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});