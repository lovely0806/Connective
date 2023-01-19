const mysql = require("mysql2");
import { withIronSession } from "next-iron-session";
import { ActivityFeed } from "services/activity/activityFeed";

export async function handler(req, res) {
  try {
    let user = req.session.get().user;
    if (typeof user == "undefined") {
      return res.status(403).json({ success: false, error: "Not signed in" });
    }

    if (req.method == "GET") {
      const connection = mysql.createConnection(process.env.DATABASE_URL);
      /*
      var [userIndustry] = await connection.promise().query(`SELECT Business.industry FROM Users JOIN Business on Users.id = Business.user_id where Users.id = ? UNION ALL SELECT Individual.industry FROM Users JOIN Individual on Users.id = Individual.user_id where Users.id = ?;`,
                            [user.id, user.id])
      userIndustry = userIndustry[0].industry
      */

      ActivityFeed.Discover.viewDiscover(user.id)

      var [results] = await connection
        .promise()
        .query(
          `SELECT Users.show_on_discover, Users.id, Users.email, Business.industry, Business.company_name as username, Business.logo, Business.description, Business.status FROM Users JOIN Business on Users.id = Business.user_id UNION ALL SELECT Users.show_on_discover, Users.id, Users.email, Individual.industry, Individual.name as username, Individual.profile_picture AS logo, Individual.bio AS description, Individual.status FROM Users JOIN Individual on Users.id = Individual.user_id;`);
      res.status(200).json(results);
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, error: e });
  }
}

export default withIronSession(handler, {
  password: process.env.APPLICATION_SECRET,
  cookieName: "Connective",
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
