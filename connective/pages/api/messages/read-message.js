const mysql = require("mysql2")
import {withIronSession} from "next-iron-session"

export async function handler(req, res) {
    try {
        let user = req.session.get().user;
        if(typeof(user) == "undefined") {
            return res.status(403).json({success: false, error: "Not signed in"})
        }
        if (req.method == "POST") {
            const connection = mysql.createConnection(process.env.DATABASE_URL);
            const IDs = req.body.data.map( message =>{
                return message.id
            })
            if (IDs.length > 0) {
                var [results] = await connection
                    .promise()
                    .query(
                        'UPDATE messages SET `read`="1" WHERE id IN ('+IDs.join(", ")+');'
                    );
            }
            res.status(200).json({success: true});
        }
    } catch(e) {
        console.log(e)
        return res.status(200).json({success: false, error: e})
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