const mysql = require("mysql2");
import { sendEmail } from "./sendEmail";

export default async function handler(req, res) {
  try {
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const { userId } = req.body;
    const { secretKey } = req.query;

    if (secretKey !== process.env.APPSMITH_SECRET_KEY) {
      return res.status(400).json({ success: false, error: "unauthorized" });
    }
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide data" });
    }
    const [result] = await connection
      .promise()
      .query(`SELECT * FROM Individual WHERE user_id = '${userId}'`);
    if (result.length) {
      const user = result[0];
      const industry = user.industry;
      let [users] = await connection
        .promise()
        .query(
          `SELECT * FROM Individual INNER JOIN Users ON Individual.user_id = Users.id WHERE industry='${industry}'`
        );
      if (users.length) {
        users = users.filter((user) => user.user_id != userId);
        users.forEach(async (user) => {
          const subject = "Connective: Status updated";
          const template = `Hello There!<br/>
A new user just joined Connective. Connect with them to form affiliate partnerships. Happy Networking!.<br/>
Thanks<br/>
Connective Team`;
          await sendEmail(subject, template, user.email);
        });
      }
    }
    res.status(200).json({ success: true });
  } catch (error) {
    return res.status(200).json({ success: false, error: error.message });
  }
}
