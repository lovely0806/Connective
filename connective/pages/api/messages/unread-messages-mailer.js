const mysql = require("mysql2")
import {mailOptions, transporter} from 'services/nodemailer'
const _ = require('lodash')

export default async function apiNewSession(req, res) {
  try {
    if (req.method == "GET") {
      const connection = mysql.createConnection(process.env.DATABASE_URL)
      var [messages] = await connection
        .promise()
        .query(
          "SELECT messages.id, Users.email FROM messages LEFT JOIN Users ON Users.id=`receiver` WHERE `read`='0' AND messages.timestamp < DATE_SUB(NOW(), interval 2 minute) AND `notified` ='0' ORDER BY timestamp DESC;"
        )

      let groupedMessages = _.mapValues(_.groupBy(messages, 'email'),
        mlist => mlist.map(msg => _.omit(msg, msg.email)))

      console.log(groupedMessages)
      await mailer(groupedMessages)
      //   console.log(results)
      res.status(200).json({ success: true})
    }
  } catch(e) {
    console.log(e)
    return res.status(200).json({success: false, error: e})
  }
}
const markSentMessages = async (messages) => {
  const connection = mysql.createConnection(process.env.DATABASE_URL)
  // console.log(ids[0])
  messages.forEach(async function(message) {
    await connection
    .promise()
    .query(
      "UPDATE messages SET `notified`='1' WHERE id ="+message.id+";"
    )
  })
}

const mailer = async (emails) =>{
  const mail = `
    <p>Hello There,</p>
    <p>You have an unread message from an affiliate partner on Connective. Please <a href="${process.env.BASE_URL}/auth/signin">sign in</a> below and respond to them.<br/>

    Thanks
    <br/>
    <br/>
    Team Connective</p>`

    for(const msg in emails)
    {
      mailOptions.to = msg
      const send = await transporter.sendMail({
        ...mailOptions,
        subject: 'Affiliate partner sent you a message',
        text: mail.replace(/<[^>]*>?/gm, ''),
        html: mail
      })

      if(send)
      {
        await markSentMessages(emails[msg])
      }
    }
}