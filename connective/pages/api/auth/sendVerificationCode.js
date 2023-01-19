const mysql = require("mysql2");
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

export default async function handler(req, res) {
  try {
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const { email } = req.body;
    const code = Math.floor(1000 + Math.random() * 9000);

    const [result] = await connection
      .promise()
      .query(`SELECT * FROM Users WHERE email='${email}'`);
    if (result.length) {
      await sendEmail(code, email);
      await connection
        .promise()
        .query(
          `UPDATE Users SET verify_email_otp = '${code}' WHERE email='${email}';`
        );
    } else {
      console.log("No user found")
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
