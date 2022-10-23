const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY
);

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const connection = mysql.createConnection(process.env.DATABASE_URL);
      const { userID } = req.body;
      var [result, fields, err] = await connection
        .promise()
        .query(`SELECT * FROM Users WHERE id='${userID}';`);
      if (result.length > 0) {
        // fetch stripeID from the db;
        const accountLink = await stripe.accountLinks.create({
          account: result[0].stripeID,
          refresh_url: "http://localhost:3000/",
          return_url: "http://localhost:3000/",
          type: "account_onboarding",
        });
        connection.close();
        // give this link to the user via email for other things for connecting his/her bank information with stripe. 
      }
    }
  } catch {}
}