const mysql = require("mysql2")
import {withIronSession} from "next-iron-session"

export async function handler(req, res) {
    const {id} = req.query
    try {
        let user = req.session.get().user
        if(typeof(user) == "undefined") {
            return res.status(500).json({success: false, error: "Not signed in"})
        }
        if(req.method == "GET") {
            let user = req.session.get().user
            if(typeof(user) == "undefined") {
                return res.status(500).json({success: false, error: "Not signed in"})
            }
            const connection = mysql.createConnection(process.env.DATABASE_URL)
            var [listResults, fields, err] = await connection.promise().query(`
                select * from Lists
                join Individual on Individual.user_id = creator
                WHERE Lists.id=${id};`)
            if(listResults.length == 0) {
                [listResults, fields, err] = await connection.promise().query(`
                select * from Lists
                join Business on Business.user_id = creator
                WHERE Lists.id=${id};`)
            }
            var [purchaseResults] = await connection.promise().query(`select * from Lists join purchased_lists on list_id = Lists.id where buyer_id = ${user.id};`)
            var alreadyPurchased = purchaseResults.length > 0
            let list = listResults[0]
            var [fieldResults, fields, err] = await connection.promise().query(`SELECT name, description FROM Fields WHERE list_id=${id};`)
            list.fields = {fieldResults}
            list.purchased = alreadyPurchased
            res.status(200).json(list)
        }
        if(req.method == "PATCH") {
            //Implement
        }
    } catch(e) {
        console.log(e)
        return res.status(500).json({success: false, error: e})
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