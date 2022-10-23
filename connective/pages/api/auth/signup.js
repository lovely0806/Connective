const mysql = require("mysql2");
var bcrypt = require("bcryptjs");

const stripe = require("stripe")(
  "sk_test_51LtYQ9BVuE7MeVAFIjmJQ9yGiwm08I12nodKQ2ZibaK8I4dJyrHckLhmk8OtrsOQS56S7m6PuynEGYNcpoOC0x8w00aIS5CxqA"
);

export default async function handler(req, res) {
  try {
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const { username, email, password } = req.body;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    var [results, fields, err] = await connection
      .promise()
      .query(`SELECT * FROM Users WHERE email='${email}';`);

    if (results.length > 0) {
      res.status(500).json({ success: false, error: "Email already exists" });
    } else {
      const stripe_account = await stripe.accounts.create({ type: "express" });
      // stripe_account.id
      // add stripe_account.id to the database # FieldName: stripeID
      connection.execute(
        `INSERT INTO Users (username, password_hash, email, stripeID) VALUES ('${username}', '${hash}', '${email}', '${stripe_account.id}');`
      );
      connection.end();
      res.status(200).json({ success: true });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: e });
  }
}
