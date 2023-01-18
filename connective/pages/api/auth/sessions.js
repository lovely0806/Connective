import { withIronSession } from "next-iron-session";
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");

export default withIronSession(
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(404).send("");
    }

    const { email, password, type = null, accessToken = null } = req.body;

    if (type === "google") {
      const connection = mysql.createConnection(process.env.DATABASE_URL);
      const [results, fields, err] = await connection
        .promise()
        .query(`SELECT * FROM Users WHERE email='${email}';`);
 
      if (
        results.length &&
        bcrypt.compareSync(accessToken, results[0].password_hash.toString())
      ) {
        let [isBusinessProfile] = await connection
          .promise()
          .query(
            `SELECT COUNT(id) FROM Business WHERE user_id='${results[0].id}';`
          );
        let [isIndividualProfile] = await connection
          .promise()
          .query(
            `SELECT COUNT(id) FROM Individual WHERE user_id='${results[0].id}';`
          );

        req.session.set("user", { email, id: results[0].id });
        await req.session.save();

        return res
          .status(201)
          .send(
            isBusinessProfile[0]["count(id)"] ||
              isIndividualProfile[0]["count(id)"]
              ? true
              : false
          );
      } else {
        return res
          .status(500)
          .json({ success: false, error: "Account does not exist" });
      }
    }

    const connection = mysql.createConnection(process.env.DATABASE_URL);
    var [results, fields, err] = await connection
      .promise()
      .query(`SELECT * FROM Users WHERE email='${email}';`);

    if (results.length == 0) {
      console.log("No account");
      return res
        .status(500)
        .json({ success: false, error: "Account does not exist" });
    }

    if (results.length) {
      const user = results[0];
      if (!user.email_verified) {
        return res
          .status(500)
          .json({ success: false, error: "Email not verified" });
      }
    }

    if (bcrypt.compareSync(password, results[0].password_hash.toString())) {
      req.session.set("user", { email, id: results[0].id });
      await req.session.save();
      let [isBusinessProfile] = await connection
        .promise()
        .query(
          `SELECT COUNT(id) FROM Business WHERE user_id='${results[0].id}';`
        );
      let [isIndividualProfile] = await connection
        .promise()
        .query(
          `SELECT COUNT(id) FROM Individual WHERE user_id='${results[0].id}';`
        );
      return res
        .status(201)
        .send(
          isBusinessProfile[0]["count(id)"] ||
            isIndividualProfile[0]["count(id)"]
            ? true
            : false
        );
    }

    return res.status(403).send("");
  },
  {
    cookieName: "Connective",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
    password: process.env.APPLICATION_SECRET,
  }
);
