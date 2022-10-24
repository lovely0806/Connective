import { withIronSession } from "next-iron-session";

const mysql = require("mysql2");

const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY
);

export async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const connection = mysql.createConnection(process.env.DATABASE_URL);
      const { userID } = req.body;
      var [result, fields, err] = await connection
        .promise()
        .query(`SELECT * FROM Users WHERE id='${userID}';`);
      connection.close();
      if (result.length > 0) {
        // fetch stripeID from the db;
        const accountLink = await stripe.accountLinks.create({
          account: result[0].stripeID,
          refresh_url: "http://localhost:3000/",
          return_url: "http://localhost:3000/",
          type: "account_onboarding",
        });
        // give this link to the user via email for other things for connecting his/her bank information with stripe. 
      }
    }
  } catch {}
};

export default withIronSession(handler, {
  password: process.env.APPLICATION_SECRET,
  cookieName: "Connective",
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});