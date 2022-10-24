const mysql = require("mysql2")
import {withIronSession} from "next-iron-session"

export async function handler(req, res) {
    const {type} = req.query
    try {
        let user = req.session.get().user
        if(typeof(user) == "undefined") {
            return res.status(500).json({success: false, error: "Not signed in"})
        }
        if(req.method == "GET") { //Returns callers account
            const connection = mysql.createConnection(process.env.DATABASE_URL)
            let query
            if(type == "business") query = `SELECT * FROM Business WHERE user_id='${user.id}';`
            else query = `SELECT * FROM Individual WHERE user_id='${user.id}';`
            var [results, fields, err] = await connection.promise().query(query)
            res.status(200).json(results[0])
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