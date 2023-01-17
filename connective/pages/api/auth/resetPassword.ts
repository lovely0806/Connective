import type { NextApiRequest, NextApiResponse } from 'next';
const mysql = require("mysql2");
const moment = require("moment");
var bcrypt = require("bcryptjs");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const { email, password, token } = req.body;

    const [result] = await connection
      .promise()
      .query(`SELECT * FROM Users WHERE email='${email}' and verification_id='${token}'`);

    if (result.length == 0) {
      return res.status(403).json({
        success: false, error: "The link is incorrect."
      })
    }

    if (result.length) {
      const user = result[0];
      if (user.verification_timestamp) {
        const diff = moment().diff(user.verification_timestamp, "minutes");

        if (diff > 15) {
          return res.status(403).json({
            success: false,
            error: "The link has expired."
          })
        }
      }
    }

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    var [results, fields, err] = await connection
      .promise()
      .query(`SELECT * FROM Users WHERE email='${email}' and verification_id = '${token}';`);

    if (results.length === 0) {
      res.status(500).json({ success: false, error: "Email doesn't exist" });
    } else {
      connection.execute(
        `UPDATE Users SET password_hash = '${hash}', verification_id = '' WHERE email='${email}';`
      );
      connection.end();
      res.status(200).json({ success: true });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: e });
  }
}
