const mysql = require("mysql2");
import { withIronSession } from "next-iron-session";

export async function handler(req, res) {
  try {
    if (typeof req.session.get().user == "undefined") {
      return res.status(500).json({ success: false, error: "Not signed in" });
    }
    if (req.method == "GET") {
      const connection = mysql.createConnection(process.env.DATABASE_URL);
      var [results] = await connection
        .promise()
        .query(
          `SELECT Users.id, Users.email, Business.company_name as username, Business.logo, Business.description FROM Users JOIN Business on Users.id = Business.user_id UNION ALL SELECT Users.id, Users.email, Individual.name as username, Individual.profile_picture AS logo, Individual.bio AS description FROM Users JOIN Individual on Users.id = Individual.user_id;`
        );
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};
