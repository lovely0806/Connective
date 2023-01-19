const mysql = require("mysql2")
import {withIronSession} from "next-iron-session"

export async function handler(req, res) {
    const {otherID} = req.query
    try {
        let user = req.session.get().user;
        if(typeof(user) == "undefined") {
            return res.status(403).json({success: false, error: "Not signed in"})
        }
        if (req.method == "GET") {
            const connection = mysql.createConnection(process.env.DATABASE_URL);
            var [results] = await connection
                .promise()
                .query(
                    `SELECT * FROM messages WHERE sender=${user.id} and receiver=${otherID} UNION ALL SELECT * FROM messages WHERE receiver=${user.id} and sender=${otherID}`
                );
            results = results.sort((a,b) => {return a.id-b.id})
            res.status(200).json(results);
        }
        if(req.method == "POST") {
            const {text} = req.body
            const connection = mysql.createConnection(process.env.DATABASE_URL);
            var [results] = await connection
                .promise()
                .query(`INSERT INTO messages (`+'`sender`'+`, `+'`receiver`'+`, `+'`text`'+`, `+'`read`'+`, `+'`notified`'+`) VALUES ('${user.id}', '${otherID}', '${text}', '0', '0')`);
            res.status(200).json(results);
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