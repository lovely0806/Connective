const mysql = require("mysql2")
import {withIronSession} from "next-iron-session"

export async function handler(req, res) {
    const {id} = req.query
    try {
        let user = req.session.get().user
        if(typeof(user) == "undefined") {
            return res.status(500).json({success: false, error: "Not signed in"})
        }
        if(req.method == "POST") {
            let user = req.session.get().user
            if(typeof(user) == "undefined") {
                return res.status(500).json({success: false, error: "Not signed in"})
            }
            const connection = mysql.createConnection(process.env.DATABASE_URL)
            var [listResults, fields, err] = await connection.promise().query(`UPDATE Lists SET published=0 WHERE id=${id} AND creator=${user.id};`)

            res.status(200).json({success: true})
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