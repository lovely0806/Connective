import { withIronSession } from "next-iron-session";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
const mysql = require("mysql2");
const moment = require("moment");
const uuid = require("uuid");

export default withIronSession(
  async (req, res) => {
    if (req.method == "POST") {
      const { email } = req.body;

      const connection = mysql.createConnection(process.env.DATABASE_URL);
      var [results, fields, err] = await connection
        .promise()
        .query(`SELECT * FROM Users WHERE email='${email}';`);

      if (results.length == 0) {
        console.log("No account");
        return res
          .status(500)
          .json({ success: false, error: "Account does not exist" });
      }

      if (results.length) {
        const user = results[0];
        console.log("session results", user);
        console.log("session user", user);
        if (!user.email_verified) {
          return res
            .status(500)
            .json({ success: false, error: "Email not verified" });
        }
      }

      const token = uuid.v4();

      await connection
        .promise()
        .query(
          `UPDATE Users SET verification_id = '${token}', verification_timestamp = "${moment().format(
            "YYYY/MM/DD HH:mm:ss"
          )}" WHERE email='${email}';`
        );

      const link = `http://localhost:3000/auth/resetpassword/${email}/${token}`;

      await sendEmail(link, email);

      res.status(200).json({ success: true });
    }
  },
  {
    cookieName: "Connective",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
    password: process.env.APPLICATION_SECRET,
  }
);

async function sendEmail(link, email) {
  return new Promise((resolve, reject) => {
    console.log("Sending an email to " + email);
    const template = `<p>Hello There,</p>
      <p>
        Connective-app.xyz has received a request to reset the password for your account.<br/>
        If you did not request to reset your password, please ignore this email.
        <br/>
        <br/>
      </p>
      <a href=${link}>Reset password now</a>`;

    const msg = {
      to: email,
      from: "notifications@connective-app.xyz",
      subject: "Reset your connective-app.xyz password",
      text: template.replace(/<[^>]*>?/gm, ""),
      html: template,
    };

    sgMail
      .send(msg)
      .then((data) => {
        console.log(`Email sent successfully to ${email}`);
        resolve(true);
      })
      .catch((error) => {
        reject(error.message);
        console.error(error);
      });
  });
}
