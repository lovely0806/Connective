import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";
import mysql from "mysql2";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, null);

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method == "GET") {
      // @ts-ignore
      let user = req.session.get().user;
      if (typeof user == "undefined") {
        return res.status(403).json({ success: false, error: "Not signed in" });
      }
      const listID = req.query.list_id;
      // fetch connected account ID from the database
      const connection = mysql.createConnection(process.env.DATABASE_URL);
      var [result, fields] = await connection
        .promise()
        .query(
          `SELECT Lists.price, Users.stripeID FROM Lists INNER JOIN Users ON Lists.creator = Users.id WHERE Lists.id="${listID}"`
        );
      // @ts-ignore
      connection.close();
      if (result[0]) {
        const listInformation = result[0];
        console.log(listInformation);
        const paymentIntent = await stripe.paymentIntents.create({
          amount: listInformation.price * 100,
          currency: "usd",
          automatic_payment_methods: {
            enabled: true,
          },
          application_fee_amount: Math.floor(
            Number(process.env.feePercentage) * listInformation.price * 100
          ),
          transfer_data: {
            destination: listInformation.stripeID,
          },
          metadata: {
            buyer: user.id,
            list: listID.toString(),
          },
        });

        return res
          .status(200)
          .json({ client_secret: paymentIntent.client_secret, error: false });
      } else {
        res.status(400).json({ client_secret: null, error: "Wrong List Id" });
      }
    } else {
      res
        .status(400)
        .json({ client_secret: null, error: "Only GET method allowed" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
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
