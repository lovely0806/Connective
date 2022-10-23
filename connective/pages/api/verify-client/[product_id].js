const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY
);

export default async function handler(req, res) {
  try {
    if (req.method == "GET") {
      const productID = req.params.product_id;
      // fetch connected account ID from the database
      const connection = mysql.createConnection(process.env.DATABASE_URL);
      var [result, fields, err] = await connection
        .promise()
        .query(`SELECT * FROM Products WHERE id='${productID}';`);
      connection.close();
      const productInformation = result[0];
      const paymentIntent = await stripe.paymentIntents.create({
        amount: productInformation.price,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        application_fee_amount: 0.10 * productInformation.price,
        transfer_data: {
          destination: productInformation.stripeID,
        },
      });

      return res
        .status(200)
        .json({ client_secret: paymentIntent.client_secret, error: false });
    }
  } catch {
    res.status(500).json({error: true});
  }
}
