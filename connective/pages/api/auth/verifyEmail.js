const mysql = require("mysql2");

export default async function handler(req, res) {
  try {
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const { code, email } = req.body;
    const [result] = await connection
      .promise()
      .query(`SELECT * FROM Users WHERE email='${email}'`);

    if (result.length) {
      const user = result[0];
      if (user.verify_email_otp === code) {
        await connection
          .promise()
          .query(
            `UPDATE Users SET verify_email_otp = null, email_verified = true WHERE email='${email}';`
          );
        const [isBusinessProfile] = await connection
          .promise()
          .query(`SELECT COUNT(id) FROM Business WHERE user_id='${user.id}';`);
        const [isIndividualProfile] = await connection
          .promise()
          .query(
            `SELECT COUNT(id) FROM Individual WHERE user_id='${user.id}';`
          );
        return res.status(201).json({
          success:
            isBusinessProfile[0]["count(id)"] ||
            isIndividualProfile[0]["count(id)"]
              ? true
              : false,
        });
      } else {
        res
          .status(200)
          .json({ success: false, error: "Incorrect verification code" });
      }
    } else {
      res.status(200).json({ success: false, error: "User not found" });
    }
  } catch (e) {
    console.log(e);
    return res.status(200).json({ success: false, error: e });
  }
}
