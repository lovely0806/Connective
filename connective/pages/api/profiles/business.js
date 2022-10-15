const mysql = require("mysql2")
import {withIronSession} from "next-iron-session"
import formidable from "formidable"
import fs from "fs"
import {Blob} from "buffer"

export const config = {
    api: {
        bodyParser: false
    }
}

const parseFormData = async (req) => {
    return new Promise((resolve, reject) => {
        const form = new formidable.IncomingForm()
        form.parse(req, async function(err, fields, files) {
            //console.log(fields)
            //console.log(files)
            let logoBlob = new Blob([fs.readFileSync(files.logo.filepath)])
            resolve({fields, logoBlob})
        })
    })
}

export async function handler(req, res) {
    try {
        let user = req.session.get().user
        if(typeof(user) == "undefined") {
            return res.status(500).json({success: false, error: "Not signed in"})
        }
        if(req.method == "GET") { //Returns callers account
            const connection = mysql.createConnection(process.env.DATABASE_URL)
            var [results, fields, err] = await connection.promise().query(`SELECT * FROM Business WHERE user_id='${user.id}';`)
            res.status(200).json(results[0])
        }
        if(req.method == "POST") {
            //const {name, description, logo, website, location, industry, size} = req.body
            let data = await parseFormData(req)
            console.log(data)
                
            const connection = mysql.createConnection(process.env.DATABASE_URL)
            await connection.promise().execute(`
                INSERT INTO Business (
                    user_id, company_name, description, website, location, industry, size
                ) VALUES (
                    '${user.id}', '${data.fields.name}', '${data.fields.description}', '${data.fields.url}', '${data.fields.location}', '${data.fields.industry}', '${data.fields.size}'
                );`)

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