import { withIronSession } from "next-iron-session";
import { DAO } from "../../../lib/dao";
var bcrypt = require("bcryptjs");

export default withIronSession(
  async (req, res) => {
    if (req.method == "POST") {
      const { email, password } = req.body;

      let user = await DAO.Users.getByEmail(email)

      if (!user) {
        console.log("No account");
        return res
          .status(500)
          .json({ success: false, error: "Account does not exist" });
      }

      console.log("session results", user);
      console.log("session user", user);
      if (!user.email_verified) {
        return res
          .status(500)
          .json({ success: false, error: "Email not verified" });
      }

      if (bcrypt.compareSync(password, user.password_hash.toString())) {
        req.session.set("user", { email, id: user.id });
        console.log(req.session.get("user"));
        await req.session.save();
        
        return res
          .status(201)
          .send(await DAO.Business.isBusiness(user.id.toString()) || await DAO.Individual.isIndividual(user.id.toString()));
      }

      return res.status(403).send("");
    }
    return res.status(404).send("");
  },
  {
    cookieName: "Connective",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
    password: process.env.APPLICATION_SECRET,
  }
);
