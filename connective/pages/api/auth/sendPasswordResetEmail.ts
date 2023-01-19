import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";
import sgMail from "@sendgrid/mail";
import mysql from "mysql2";
import moment from "moment";
import uuid from "uuid";

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

export default withIronSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST") {
      const { email } = req.body;

      const connection = mysql.createConnection(process.env.DATABASE_URL);
      var [results, fields] = await connection
        .promise()
        .query(`SELECT * FROM Users WHERE email='${email}';`);

      if (!results[0]) {
        console.log("No account");
        return res
          .status(500)
          .json({ success: false, error: "Account does not exist" });
      }

      if (results[0]) {
        const user = results[0];
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

      const link = `http://${req.headers.host}/auth/resetpassword/${email}/${token}`;

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

async function sendEmail(link: string, email: string) {
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
