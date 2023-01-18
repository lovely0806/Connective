import type { NextApiRequest, NextApiResponse } from 'next';
const mysql = require("mysql2");
const moment = require("moment");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const { token, email } = req.body;
    const [result] = await connection
      .promise()
      .query(`SELECT * FROM Users WHERE email='${email}' and verification_id='${token}'`);

    if (result.length == 0 || token == "") {
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

        res.status(200).json({ success: true });
      }
    }
  } catch (e) {
    console.log(e);
    return res.status(200).json({ success: false, error: e });
  }
}
