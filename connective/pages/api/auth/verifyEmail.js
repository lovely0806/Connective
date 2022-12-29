const mysql = require("mysql2");

export default async function handler(req, res) {
  try {
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const { code, email } = req.body;
    const [result] = await connection
      .promise()
      .query(`SELECT * FROM Users WHERE email='${email}'`);
    console.log("result", result);
    if (result.length) {
      const user = result[0];
      if (user.verify_email_otp === code) {
        await connection
          .promise()
          .query(
            `UPDATE Users SET verify_email_otp = null, email_verified = true WHERE email='${email}';`
          );
        res.status(200).json({ success: true });
      } else {
        res.status(200).json({ success: false, error: "OTP did not matched" });
      }
    } else {
      res.status(200).json({ success: false, error: "User not found" });
    }
  } catch (e) {
    console.log(e);
    return res.status(200).json({ success: false, error: e });
  }
}
