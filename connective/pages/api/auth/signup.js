const mysql = require("mysql2")
var bcrypt = require("bcryptjs")

export default async function handler(req, res) {
    try {
        const connection = mysql.createConnection(process.env.DATABASE_URL)
        const {username, email, password} = req.body

        var salt = bcrypt.genSaltSync(10)
        var hash = bcrypt.hashSync(password, salt)

        var [results, fields, err] = await connection.promise().query(`SELECT * FROM Users WHERE email='${email}';`)

        if(results.length > 0) {
            res.status(500).json({success: false, error: "Email already exists"})
        } else {
            connection.execute(`INSERT INTO Users (username, password_hash, email) VALUES ('${username}', '${hash}', '${email}');`)
            connection.end()
            res.status(200).json({ success: true });
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({success: false, error: e})
    }
}