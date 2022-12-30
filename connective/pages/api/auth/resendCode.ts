const mysql = require("mysql2");
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
const moment = require("moment");

export default async function handler(req, res) {
  try {
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const { code, email } = req.body;
    const [result] = await connection
      .promise()
      .query(`SELECT * FROM Users WHERE email='${email}'`);
    if (result.length) {
      const user = result[0];
      console.log("==============user", user);
      if (user.send_code_attempt && user.send_code_attempt == 2) {
        const lastCodeSentTime = user.last_code_sent_time;
        console.log("lastCodeSentTime", lastCodeSentTime);
        const diff = moment().diff(lastCodeSentTime, "minutes");

        if (diff < 15) {
          return res.status(200).json({
            success: false,
            error: "You can send another code in 15 minutes",
          });
        }
      }
      await sendEmail(code, email);
      const sendCodeAttemp = user.send_code_attempt
        ? Number(user.send_code_attempt) + 1
        : 1;
      await connection
        .promise()
        .query(
          `UPDATE Users SET verify_email_otp = '${code}', send_code_attempt = ${sendCodeAttemp}, last_code_sent_time = "${moment().format(
            "YYYY/MM/DD HH:mm:ss"
          )}" WHERE email='${email}';`
        );
    }
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    return res.status(200).json({ success: false, error: e });
  }
}

async function sendEmail(code, email) {
  return new Promise((resolve, reject) => {
    console.log("Sending an email to " + email);
    const template = `<p>Hello There,</p>
      <p>${code}, Please use this otp to verify your email address.<br/>

      Thanks
      <br/>
      <br/>
      Team Connective</p>`;

    const msg = {
      to: email,
      from: "notifications@connective-app.xyz",
      subject: "Email Verification",
      text: template.replace(/<[^>]*>?/gm, ""),
      html: template,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log(`Email sent successfully to ${email}`);
        resolve();
      })
      .catch((error) => {
        console.error(error);
      });
  });
}
