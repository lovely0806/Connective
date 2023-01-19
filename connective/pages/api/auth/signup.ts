import { DAO } from "../../../lib/dao";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import bcrypt from "bcryptjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, null);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { username, email, password } = req.body;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    var user = await DAO.Users.getByEmail(email);

    if (user) {
      res.status(500).json({ success: false, error: "Email already exists" });
    } else {
      const stripe_account = await stripe.accounts.create({ type: "express" });

      await DAO.Users.add(username, hash, email, stripe_account.id);
      res.status(200).json({ success: true });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: e });
  }
}
