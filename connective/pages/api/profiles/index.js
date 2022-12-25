const mysql = require("mysql2");

export default async function handler(req, res) {
  try {
    if (req.method == "GET") {
      const connection = mysql.createConnection(process.env.DATABASE_URL);
      var [results] = await connection
        .promise()
        .query(
          `SELECT Users.show_on_discover, Users.id, Users.email, Business.industry, Business.company_name as username, Business.logo, Business.description, Business.status FROM Users JOIN Business on Users.id = Business.user_id UNION ALL SELECT Users.show_on_discover, Users.id, Users.email, '' as industry, Individual.name as username, Individual.profile_picture AS logo, Individual.bio AS description, Individual.status FROM Users JOIN Individual on Users.id = Individual.user_id;`
        );
      res.status(200).json(results);
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, error: e });
  }
}
