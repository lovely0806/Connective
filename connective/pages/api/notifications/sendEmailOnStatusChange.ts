const mysql = require("mysql2");
import { sendEmail } from "../../../lib/notifications/sendEmail";
import { DAO } from "../../../lib/dao";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const { userId, status, profile } = req.body;

    let user = null;
    if (profile === "Individual") {
      user = await DAO.Individual.getByUserId(userId);
    } else {
      user = await DAO.Business.getByUserId(userId);
    }

    if (user) {
      const industry: number = user.industry;
      let users = await DAO.Notifications.getUsersOfSameIndustry(
        industry,
        profile
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
