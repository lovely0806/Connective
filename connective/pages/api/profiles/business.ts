import { withIronSession } from "next-iron-session";
import type { NextApiRequest, NextApiResponse } from 'next'
import { DAO } from "../../../lib/dao";

export async function handler(req: any, res: NextApiResponse) {
  try {
    let user = req.session.get().user;
    if (typeof user == "undefined") {
      return res.status(403).json({ success: false, error: "Not signed in" });
    }
    if (req.method == "GET") {
      let { id } = req.query;
      if (typeof id == "undefined") id = user.id;

      //Returns callers account
      var business = await DAO.Business.getByUserId(id)
      /*
      var [listResults, listFields, listErr] = await connection
        .promise()
        .query(
          `SELECT Lists.*, Business.company_name AS username, Business.logo, Business.status FROM Lists JOIN Business on Lists.creator = Business.user_id WHERE creator=${id};`
        );

      var [purchaseResults, fields, err] = await connection
        .promise()
        .query(
          `select * from Lists join purchased_lists on purchased_lists.list_id = Lists.id;`
        );

      listResults.forEach((list) => {
        list.buyers = purchaseResults.filter((i) => {
          if (i.list_id == list.id) return 1;
        }).length;
      });

      business.lists = listResults;
      */
      res.status(200).json(business);
    }
    if (req.method == "POST") {
      const { name, description, pfp, url, location, industry, occupation, size, status } =
        req.body;
<<<<<<< HEAD:connective/pages/api/profiles/business.ts
      await DAO.Business.add(user.id, name, description, pfp, url, location, industry, size, status)
=======

      const connection = mysql.createConnection(process.env.DATABASE_URL);
      await connection.promise().execute(`
                INSERT INTO Business (
                    user_id, company_name, description, logo, website, location, industry, occupation, size, status
                ) VALUES (
                    '${user.id}', '${name}', '${description}', '${pfp}', '${url}', '${location}', '${industry}', '${occupation}', '${size}', '${status}'
                );`);

      connection.end();
>>>>>>> master:connective/pages/api/profiles/business.js
      res.status(200).json({ success: true });
    }
    if (req.method == "PATCH") {
      //Implement
    }
    if (req.method == "PUT") {
      const {
        name,
        pfp,
        location,
        description,
        industry,
        size,
        url,
        pfpChanged,
        status,
      } = req.body;

      await DAO.Business.update(user.id, name, pfpChanged, pfp, description, location, industry, size, url, status)
      
      res.status(200).json({ success: true });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, error: e });
  }
}

export default withIronSession(handler, {
  password: process.env.APPLICATION_SECRET,
  cookieName: "Connective",
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
