const mysql = require("mysql2");
import { NextApiRequest, NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query;
  try {
    // @ts-ignore
    let user = req.session.get().user;
    if (typeof user == "undefined") {
      return res.status(403).json({ success: false, error: "Not signed in" });
    }
    if (req.method == "GET") {
      // Returns callers account
      const connection = mysql.createConnection(process.env.DATABASE_URL);
      let query = "";
      if (type == "business") {
        query = `SELECT * FROM Business WHERE user_id='${user.id}';`;
      } else {
        query = `SELECT * FROM Individual WHERE user_id='${user.id}';`;
      }
      var [listsViewedResults] = await connection.promise().query(query);
      let listsViewed = listsViewedResults[0]?.listViews;

      query = `select * from Lists join purchased_lists on purchased_lists.list_id = Lists.id WHERE buyer_id = ${user.id}`;
      var [purchasedListsResults] = await connection.promise().query(query);
      var purchasedLists = purchasedListsResults.length;
      var totalSpent = 0;
      purchasedListsResults.forEach((item) => {
        totalSpent += item.price;
      });

      query = `select * from Lists where creator = ${user.id}`;
      var [createdListResults] = await connection.promise().query(query);
      var listsCreated = createdListResults.length;

      query = `select * from Lists join purchased_lists on purchased_lists.list_id = Lists.id WHERE creator = ${user.id};`;
      var [soldListResults] = await connection.promise().query(query);
      var listsSold = soldListResults.length;
      var totalEarned = 0;
      soldListResults.forEach((item) => {
        totalEarned += item.price;
      });

      console.log("Lists Viewed: " + listsViewed);
      console.log("Purchased Lists: " + purchasedLists);

      res.status(200).json({
        listsViewed,
        purchasedLists,
        totalSpent,
        listsCreated,
        listsSold,
        totalEarned,
      });
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
