const mysql = require("mysql2");
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
const uuid = require("uuid");
const moment = require("moment");

export default async function handler(req, res) {
  try {
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const { email } = req.body;
    const [result] = await connection
      .promise()
      .query(`SELECT * FROM Users WHERE email='${email}'`);
    if (result.length) {
      const user = result[0];
      if (user.send_code_attempt && user.send_code_attempt == 2) {
        const lastLinkSentTime = user.verification_timestamp;
        const diff = moment().diff(lastLinkSentTime, "minutes");

        if (diff < 15) {
          return res.status(200).json({
            success: false,
            error: "You can send only 2 requests in 15 minutes",
          });
        }
      }

      const token = uuid.v4();
      const link = `http://localhost:3000/auth/resetpassword/${email}/${token}`;

      await sendEmail(link, email);

      const sendCodeAttemp = user.send_code_attempt
        ? Number(user.send_code_attempt) + 1
        : 1;

      await connection
        .promise()
        .query(
          `UPDATE Users SET verification_id = '${token}', send_code_attempt = ${sendCodeAttemp}, verification_timestamp = "${moment().format(
            "YYYY/MM/DD HH:mm:ss"
          )}" WHERE email='${email}';`
        );
    }
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, error: e });
  }
}

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
