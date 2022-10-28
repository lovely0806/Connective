import { withIronSession } from "next-iron-session";
const mysql = require("mysql2");
const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY
);

export async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const connection = mysql.createConnection(process.env.DATABASE_URL);
      let user = req.session.get().user
      if(typeof(user) == "undefined") {
          return res.status(500).json({success: false, error: "Not signed in"})
      }
      var [result, fields, err] = await connection
        .promise()
        .query(`SELECT * FROM Users WHERE id='${user.id}';`);
      connection.close();
      if (result.length > 0) {
        const acc = await stripe.accounts.retrieve({
            stripeAccount: result[0].stripeID
        });
        return res.json({ success: true, verified: acc.charges_enabled })
      } else {
        return res.json({ error: "User not found", success: false });
      }
    } else {
      return res.json({ error: "Only GET request is valid", success: false });
    }
  } catch {
    return res.json({ error: "Server error", success: false });
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