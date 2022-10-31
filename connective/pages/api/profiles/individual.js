const mysql = require("mysql2");
import { withIronSession } from "next-iron-session";

export async function handler(req, res) {
  try {
    let user = req.session.get().user;
    if (typeof user == "undefined") {
      return res.status(500).json({ success: false, error: "Not signed in" });
    }
    if (req.method == "GET") {
      //Returns callers account
      const connection = mysql.createConnection(process.env.DATABASE_URL);
      var [results, fields, err] = await connection
        .promise()
        .query(`SELECT * FROM Individual WHERE user_id='${user.id}';`);
      var [listResults, listFields, listErr] = await connection
        .promise()
        .query(
          `SELECT Lists.*, Individual.name AS username, Individual.profile_picture AS logo FROM Lists JOIN Individual on Lists.creator = Individual.user_id WHERE creator=${user.id};`
        );
      console.log(results);
      results[0].lists = listResults;
      res.status(200).json(results[0]);
    }
    if (req.method == "POST") {
      const { name, bio, pfp, location } = req.body;

      const connection = mysql.createConnection(process.env.DATABASE_URL);
      await connection.promise().execute(`
                INSERT INTO Individual (
                    user_id, name, profile_picture, bio, location
                ) VALUES (
                    '${user.id}', '${name}', '${pfp}', '${bio}', '${location}'
                );`);

      connection.end();
      res.status(200).json({ success: true });
    }
    if (req.method == "PATCH") {
      //Implement
    }
    if (req.method == "PUT") {
      console.log(user);
      const { name, bio, pfp, location } = req.body;
      const connection = mysql.createConnection(process.env.DATABASE_URL);
      await connection.promise().execute(`
                UPDATE Individual
                SET name = '${name}', profile_picture = '${pfp}', bio = '${bio}', location = '${location}'
                WHERE user_id = '${user.id}';`);
      connection.end();
      res.status(200).json({ success: true });
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
