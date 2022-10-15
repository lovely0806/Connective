import {withIronSession} from "next-iron-session"
const mysql = require("mysql2")
var bcrypt = require("bcryptjs")

export default withIronSession (
    async (req, res) => {
        if(req.method == "POST") {
            const {email, password} = req.body

            const connection = mysql.createConnection(process.env.DATABASE_URL)
            var [results, fields, err] = await connection.promise().query(`SELECT * FROM Users WHERE email='${email}';`)
            
            if(results.length == 0) {
                console.log("No account")
                return res.status(500).json({success: false, error: "Account does not exist"})
            }

            if (bcrypt.compareSync(password, results[0].password_hash.toString())) {
                req.session.set("user", {email, id: results[0].id})
                console.log(req.session.get("user"))
                await req.session.save()
                return res.status(201).send("")
            }

            return res.status(403).send("")
        }
        return res.status(404).send("")
    },
    {
        cookieName: "Connective",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production"
        },
        password: process.env.APPLICATION_SECRET
    }
)