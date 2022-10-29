const client = require("@sendgrid/mail");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "GET") {
    const stripe_account = await stripe.accounts.create({ type: "express" });
    console.log(stripe_account.id);
  }
}
