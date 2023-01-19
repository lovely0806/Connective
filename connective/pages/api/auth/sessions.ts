import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";
import bcrypt from "bcryptjs";
import { DAO } from "../../../lib/dao";

export default withIronSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
      return res.status(404).send("");
    }

    const {
      email,
      password,
      rememberme,
      type = null,
      accessToken = null,
    } = req.body;

    if (type === "google") {
      const user = await DAO.Users.getByEmail(email);

      if (!user) {
        console.log("No account");
        return res
          .status(500)
          .json({ success: false, error: "Account does not exist" });
      }

      if (user) {
        if (!user.email_verified) {
          return res
            .status(500)
            .json({ success: false, error: "Email not verified" });
        }
      }

      if (bcrypt.compareSync(accessToken, user.password_hash.toString())) {
        // @ts-ignore
        req.session.set("user", { email, id: user.id });
        // @ts-ignore
        await req.session.save();

        const isBusinessAccount = await DAO.Business.isBusiness(user.id);
        const isIndividualAccount = await DAO.Individual.isIndividual(user.id);

        // @ts-ignore
        req.session.set("user", { email, id: user.id });
        // @ts-ignore
        await req.session.save();

        return res
          .status(201)
          .send(isBusinessAccount || isIndividualAccount ? true : false);
      } else {
        return res
          .status(500)
          .json({ success: false, error: "Account does not exist" });
      }
    }

    const user = await DAO.Users.getByEmail(email);

    if (!user) {
      console.log("No account");
      return res
        .status(500)
        .json({ success: false, error: "Account does not exist" });
    }

    if (user) {
      if (!user.email_verified) {
        return res
          .status(500)
          .json({ success: false, error: "Email not verified" });
      }
    }

    if (bcrypt.compareSync(password, user.password_hash.toString())) {
      // @ts-ignore
      req.session.set("user", { email, id: user.id, rememberme });
      // @ts-ignore
      await req.session.save();

      const isBusinessAccount = await DAO.Business.isBusiness(user.id);
      const isIndividualAccount = await DAO.Individual.isIndividual(user.id);

      return res
        .status(201)
        .send(isBusinessAccount || isIndividualAccount ? true : false);
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
