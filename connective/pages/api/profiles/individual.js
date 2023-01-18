/**Deprecated */
const mysql = require("mysql2");
import { withIronSession } from "next-iron-session";

export async function handler(req, res) {
  try {
    let user = req.session.get().user;
    if (typeof user == "undefined") {
      return res.status(403).json({ success: false, error: "Not signed in" });
    }
    if (req.method == "GET") {
      let { id } = req.query;
      if (typeof id == "undefined") id = user.id;
      //Returns callers account
      const connection = mysql.createConnection(process.env.DATABASE_URL);
      var [results, fields, err] = await connection
        .promise()
        .query(`SELECT * FROM Individual WHERE user_id='${id}';`);
      var [listResults, listFields, listErr] = await connection
        .promise()
        .query(
          `SELECT Lists.*, Individual.name AS username, Individual.profile_picture AS logo, Individual.status FROM Lists JOIN Individual on Lists.creator = Individual.user_id WHERE creator=${id};`
        );
      var [purchaseResults, fields, err] = await connection
        .promise()
        .query(
          `select * from Lists join purchased_lists on purchased_lists.list_id = Lists.id;`
        );

      listResults.forEach((list) => {
        list.buyers = purchaseResults.filter((i) => {
          if (i.list_id == list.id) return 1;
        }).length;
      });

      results[0].lists = listResults;
      res.status(200).json(results[0]);
    }
    if (req.method == "POST") {
      const { name, bio, pfp, location, status, industry, occupation } = req.body;
      console.log(req.body)

      const connection = mysql.createConnection(process.env.DATABASE_URL);
      await connection.promise().execute(
        `
                INSERT INTO Individual (
                    user_id, name, profile_picture, bio, location, status, industry, occupation
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [user.id, name, pfp, bio, location, status, industry, occupation]
      );

      connection.end();
      res.status(200).json({ success: true });
    }
    if (req.method == "PATCH") {
      //Implement
    }
    if (req.method == "PUT") {
      // console.log(user);
      const { name, bio, pfp, location, pfpChanged, status } = req.body;
      const connection = mysql.createConnection(process.env.DATABASE_URL);
      let query;
      if (pfpChanged) {
        query = `UPDATE Individual SET name = '${name}', ${
          pfpChanged ?? "profile_picture =" + `'${pfp}',`
        } bio = '${bio}', location = '${location}', status = '${status}' WHERE user_id = '${
          user.id
        }';`;
      } else {
        query = `UPDATE Individual SET name = '${name}',bio = '${bio}', location = '${location}', status = '${status}' WHERE user_id = '${user.id}';`;
      }
      await connection.promise().execute(query);

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
