const mysql = require("mysql2")
import {withIronSession} from "next-iron-session"

export async function handler(req, res) {
    try {
        if(typeof(req.session.get().user) == "undefined") {
            return res.status(500).json({success: false, error: "Not signed in"})
        }
        if(req.method == "POST") {
            const {id, type} = req.body 
            const connection = mysql.createConnection(process.env.DATABASE_URL)
            
            let query
            if(type == "business") query = `UPDATE Business SET profileViews = profileViews + 1 WHERE user_id='${id}';`
            else query = `UPDATE Individual SET profileViews = profileViews + 1 WHERE user_id='${id}';`
            await connection.promise().query(query)

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

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "4mb"
        }
    }
}