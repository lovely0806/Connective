import { withIronSession } from "next-iron-session";

const mysql = require("mysql2");
const nodemailer = require('nodemailer');

const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY
);

export async function handler(req, res) {
  try {
    if (req.method === "POST") {
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
        // fetch stripeID from the db;
        const accountLink = await stripe.accountLinks.create({
          account: result[0].stripeID,
          refresh_url: process.env.refreshURL,
          return_url: process.env.returnURL,
          type: "account_onboarding",
        });
        // give this link to the user via email for other things for connecting his/her bank information with stripe. 
        // email
        const transporter = nodemailer.createTransport({
          host: 'smtp.connective.com',
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const options = {
          from: '', // your email
          to: `${result[0].email}`,
          subject: 'Connect your Bank Information',
          text: accountLink.url,
          html: '' // post your HTML page for email here
        };

        transporter.sendMail(options, (err, info)  => {
          if (err) {
            return res.json({ error: "Couldn't send email" })
          } else {
            return res.json({ success: true })
          }
        })

      } else {
        return res.json({ error: "User not found", success: false });
      }
    } else {
      return res.json({ error: "Only POST request is valid", success: false });
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