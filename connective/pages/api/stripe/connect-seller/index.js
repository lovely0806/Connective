import { withIronSession } from "next-iron-session";

const mysql = require("mysql2");
const client = require("@sendgrid/mail");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const connection = mysql.createConnection(process.env.DATABASE_URL);
      let user = req.session.get().user;
      if (typeof user == "undefined") {
        return res.status(500).json({ success: false, error: "Not signed in" });
      }
      var [result, fields, err] = await connection
        .promise()
        .query(`SELECT * FROM Users WHERE id='${user.id}';`);
      connection.close();
      if (result.length > 0) {
        // fetch stripeID from the db;
        const accountLink = await stripe.accountLinks.create({
          account: result[0].stripeID,
          refresh_url: process.env.refreshURL,
          return_url: process.env.returnURL,
          type: "account_onboarding",
        });
        // also might update the db with userOnbarded to true
        // give this link to the user via email for other things for connecting his/her bank information with stripe.
        // email
        client.setApiKey(process.env.SEND_GRID_API_KEY);
        client
          .send({
            from: process.env.EMAIL_USER,
            to: result[0].email,
            subject: "Verify your payment details for Connective",
            html: `<h1>Welcome to Connective</h1><br/> <div>Please <a href=${accountLink.url} style="color: '#00acee'">click here</a> to configure your payment details.</div>`,
          })
          .then(() => {
            return res.status(200).json({ success: true });
          })
          .catch((error) => {
            console.log(error);
            return res
              .status(500)
              .json({ error: "Email doesnot work", success: false });
          });
      } else {
        return res.json({ error: "User not found", success: false });
      }
    } else {
      return res.json({ error: "Only POST request is valid", success: false });
    }
  } catch {
    return res.json({ error: "Server error", success: false });
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
