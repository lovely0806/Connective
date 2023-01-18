import {DAO} from "../../../lib/dao";
import type { NextApiRequest, NextApiResponse } from 'next'
var bcrypt = require("bcryptjs");
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: any, res: NextApiResponse) {
  try {
    const { username, email, password } = req.body;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    var user = await DAO.Users.getByEmail(email)

    if (user) {
      res.status(500).json({ success: false, error: "Email already exists" });
    } else {
      const stripe_account = await stripe.accounts.create({ type: "express" });
      // stripe_account.id
      // add stripe_account.id to the User database # FieldName: stripeID

      await DAO.Users.add(username, hash, email, stripe_account.id)
      res.status(200).json({ success: true });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: e });
  }
}
