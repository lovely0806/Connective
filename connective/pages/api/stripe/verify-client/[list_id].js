import { withIronSession } from "next-iron-session";

const mysql = require("mysql2");

const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY
);

export async function handler(req, res) {
  try {
    if (req.method == "GET") {
      const listID = req.params.list_id;
      // fetch connected account ID from the database
      const connection = mysql.createConnection(process.env.DATABASE_URL);
      var [result, fields, err] = await connection
        .promise()
        .query(`SELECT * FROM Lists WHERE id='${listID}';`);
      connection.close();
      const listInformation = result[0];
      const paymentIntent = await stripe.paymentIntents.create({
        amount: listInformation.price,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        application_fee_amount: 0.10 * listInformation.price,
        transfer_data: {
          destination: listInformation.stripeID,
        },
      });

      return res
        .status(200)
        .json({ client_secret: paymentIntent.client_secret, error: false });
    }
  } catch {
    res.status(500).json({error: true});
  }
};

export default withIronSession(handler, {
  password: process.env.APPLICATION_SECRET,
  cookieName: "Connective",
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
