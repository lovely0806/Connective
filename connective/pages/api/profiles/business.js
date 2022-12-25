const mysql = require("mysql2");
import { withIronSession } from "next-iron-session";

export async function handler(req, res) {
  try {
    let user = req.session.get().user;
    if (typeof user == "undefined") {
      return res.status(500).json({ success: false, error: "Not signed in" });
    }
    if (req.method == "GET") {
      let { id } = req.query;
      if (typeof id == "undefined") id = user.id;

      //Returns callers account
      const connection = mysql.createConnection(process.env.DATABASE_URL);
      var [results, fields, err] = await connection
        .promise()
        .query(`SELECT * FROM Business WHERE user_id='${id}';`);
      var [listResults, listFields, listErr] = await connection
        .promise()
        .query(
          `SELECT Lists.*, Business.company_name AS username, Business.logo, Business.status FROM Lists JOIN Business on Lists.creator = Business.user_id WHERE creator=${id};`
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
      const { name, description, pfp, url, location, industry, size, status } =
        req.body;

      const connection = mysql.createConnection(process.env.DATABASE_URL);
      await connection.promise().execute(`
                INSERT INTO Business (
                    user_id, company_name, description, logo, website, location, industry, size, status
                ) VALUES (
                    '${user.id}', '${name}', '${description}', '${pfp}', '${url}', '${location}', '${industry}', '${size}', '${status}'
                );`);

      connection.end();
      res.status(200).json({ success: true });
    }
    if (req.method == "PATCH") {
      //Implement
    }
    if (req.method == "PUT") {
      const {
        name,
        pfp,
        location,
        description,
        industry,
        size,
        url,
        pfpChanged,
        status,
      } = req.body;
      console.log(status);
      const connection = mysql.createConnection(process.env.DATABASE_URL);
      await connection.promise().execute(`
                  UPDATE Business
                  SET company_name = '${name}', ${
        pfpChanged ? "logo =" + `'${pfp}',` : ""
      } description = '${description}', location = '${location}', industry = '${industry}', size = '${size}', website = '${url}', status = '${status}' WHERE user_id = '${
        user.id
      }';`);
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
