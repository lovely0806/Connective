const client = require("@sendgrid/mail");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const stripe_account = await stripe.accounts.create({ type: "express" });
    const accountLink = await stripe.accountLinks.create({
      account: stripe_account.id,
      refresh_url: process.env.refreshURL,
      return_url: process.env.returnURL,
      type: "account_onboarding",
    });
    client.setApiKey(process.env.SEND_GRID_API_KEY);
    client
      .send({
        from: process.env.EMAIL_USER,
        to: "abhinavbhattarai09@gmail.com",
        subject: "Verify your payment details for Connective",
        html: `<h1>Welcome to Connective</h1><br/> <div>Please <a href=${accountLink.url} style="color: '#00acee'">click here</a> to configure your payment details.</div>`,
      })
      .then(() => {
        return res.status(200).json({ success: true });
      })
      .catch((error) => {
        console.log(error);
        return res
          .status(500)
          .json({ error: "Email doesnot work", success: false });
      });
  }
}
