import type { NextApiRequest, NextApiResponse } from 'next';
const mysql = require("mysql2");
var bcrypt = require("bcryptjs");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const { email, password, token } = req.body;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    var [results, fields, err] = await connection
      .promise()
      .query(`SELECT * FROM Users WHERE email='${email}' and verification_id = '${token}';`);

    if (results.length === 0) {
      res.status(500).json({ success: false, error: "Email doesn't exist" });
    } else {
      connection.execute(
        `UPDATE Users SET password_hash = '${hash}' WHERE email='${email}';`
      );
      connection.end();
      res.status(200).json({ success: true });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: e });
  }
}
