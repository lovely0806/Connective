const mysql = require("mysql2")

export async function handler(req, res)
{
    try {
        if(req.method === 'POST')
        {
            var [messages] = await connection
            .promise()
            .query(
              'SELECT DISTINCT `sender`, `receiver`, `text`, `read` FROM  messages WHERE `read`<>"1";'
            )

            messages.forEach(async message => {
                var [user] = await connection
                .promise()
                .query(
                'SELECT `email`, `username`, `id` FROM Users WHERE `id`="'+message.receiver+'";'
                )
                message.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
                
            })
        }
    } catch (error) {
        return res.status(422).json({success: false})
    }
}