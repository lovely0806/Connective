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
            const connection = mysql.createConnection(process.env.DATABASE_URL)
            var [listResults, fields, err] = await connection.promise().query(`SELECT * FROM Lists WHERE id=${id};`)
            let list = listResults[0]
            var [fields, fields, err] = await connection.promise().query(`SELECT * FROM Fields WHERE list_id=${id};`)
            list.fields = {fields}
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