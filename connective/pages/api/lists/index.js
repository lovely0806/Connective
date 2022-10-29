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
            var [results, fields, err] = await connection.promise().query(`SELECT Lists.*, Business.company_name AS username, Business.logo FROM Lists JOIN Business on Lists.creator = Business.user_id UNION ALL SELECT Lists.*, Individual.name AS username, Individual.profile_picture AS logo FROM Lists JOIN Individual on Lists.creator = Individual.user_id;`)
            var [purchaseResults, fields, err] = await connection.promise().query(`select * from Lists join purchased_lists on purchased_lists.list_id = Lists.id;`)

            results.forEach(list => {
                list.buyers = purchaseResults.filter((i) => {if(i.list_id == list.id) return 1}).length
            })
            res.status(200).json(results)
        }
        if(req.method == "POST") {
            const {title, category, description, geo, obtain, price, uploadUrl, previewUrl, coverUrl, fields} = req.body

            const connection = mysql.createConnection(process.env.DATABASE_URL)
            let [result, err, returnFields] = await connection.promise().execute(`
                INSERT INTO Lists (
                    creator, title, category, description, location, list_obtained, price, url, preview_url, cover_url, published
                ) VALUES (
                    '${user.id}', '${title}', '${category}', '${description}', '${geo}', '${obtain}', '${price}', '${uploadUrl}', '${previewUrl}', '${coverUrl}', '1'
                );`)
            
            let fieldValues = []
            fields.forEach(field => {
                fieldValues.push([result.insertId, field.name, field.description])
            })

            if(fieldValues.length > 0) {
                let sql = "INSERT INTO Fields (list_id, name, description) VALUES ?"
                await connection.promise().query(sql, [fieldValues])
            }

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