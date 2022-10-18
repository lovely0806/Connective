const mysql = require("mysql2")
import {withIronSession} from "next-iron-session"

export async function handler(req, res) {
    try {
        let user = req.session.get().user
        if(typeof(user) == "undefined") {
            return res.status(500).json({success: false, error: "Not signed in"})
        }
        if(req.method == "GET") {
            const connection = mysql.createConnection(process.env.DATABASE_URL)
            var [results, fields, err] = await connection.promise().query(`SELECT * FROM Lists;`)
            res.status(200).json(results)
        }
        if(req.method == "POST") {
            const {title, description, geo, obtain, price, uploadUrl, previewUrl, fields} = req.body
                
            const connection = mysql.createConnection(process.env.DATABASE_URL)
            let [result, err, returnFields] = await connection.promise().execute(`
                INSERT INTO Lists (
                    creator, title, description, location, list_obtained, price, url, preview_url, published
                ) VALUES (
                    '${user.id}', '${title}', '${description}', '${geo}', '${obtain}', '${price}', '${uploadUrl}', '${previewUrl}', '0'
                );`)
            
            let fieldValues = []
            fields.forEach(field => {
                fieldValues.push([result.insertId, field.name, field.description])
            })

            let sql = "INSERT INTO Fields (list_id, name, description) VALUES ?"
            await connection.promise().query(sql, [fieldValues])

            connection.end()
            res.status(200).json({success: true})  
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