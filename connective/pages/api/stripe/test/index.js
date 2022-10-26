const client = require("@sendgrid/mail");

export default function handler(req, res) {
  if (req.method === "POST") {
    client.setApiKey(process.env.SEND_GRID_API_KEY);
    client
      .send({
        from: process.env.EMAIL_USER,
        to: "aweb5031@gmail.com",
        subject: "Bank Verification",
        html: "<h1>HELLO WORLD</h1>"
      })
      .then(() => {
        return res.status(200).json({ success: true });
      })
      .catch((error) => {
        console.log(error)
        return res
          .status(500)
          .json({ error: "Email doesnot work", success: false });
      });
  }
};
