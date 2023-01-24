const mysql = require("mysql2");
import { sendEmail } from "./sendEmail";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const { userId, status } = req.body;
    const [result] = await connection
      .promise()
      .query(`SELECT * FROM Individual WHERE user_id='${userId}'`);
    if (result.length) {
      const user = result[0];
      const industry: number = user.industry;
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
${user.name} on their platform updated the status to ${status} Please message them if they fit your affiliate partnership criteria.<br/>
Thanks<br/>
Team Connective`;
          await sendEmail(subject, template, user.email);
        });
      }
    }
    res.status(200).json({ success: true });
  } catch (error) {
    return res.status(200).json({ success: false, error: error.message });
  }
}
