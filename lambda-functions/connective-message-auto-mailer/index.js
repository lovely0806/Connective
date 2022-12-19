import {} from 'dotenv/config'
import mysql from 'mysql2'
import {mailOptions, transporter} from './services/nodemailer.js'
import _ from 'lodash'
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_KEY)

const connection = mysql.createConnection(process.env.DATABASE_URL)

export const handler = async (event) => {
    try {
            var [messages] = await connection
          .promise()
          .query(
            "SELECT messages.id, Users.email FROM messages LEFT JOIN Users ON Users.id=`receiver` WHERE `read`='0' AND messages.timestamp < DATE_SUB(NOW(), interval "+process.env.MESSAGE_INTERVAL+") AND `notified` ='0' ORDER BY timestamp DESC;"
          )
          console.log(messages)
        
          let groupedMessages = _.mapValues(_.groupBy(messages, 'email'),
          mlist => mlist.map(msg => _.omit(msg, msg.email)))
          
        await mailer(groupedMessages)
        
  } catch(e) {
      console.log(e)
  }
}
const markSentMessages = async (messages) => {
  
     const messagesIDs = messages.map(msg => {
          return msg.id
      })
    
      await connection
      .promise()
      .query(
        "UPDATE messages SET `notified`='1' WHERE id IN ("+messagesIDs.join(", ")+");"
      )
}

const mailer = async (emails) =>{
      for(const msg in emails)
      {
            await sendEmail(msg)
            await markSentMessages(emails[msg])
      }
}

async function sendEmail(to) {
  return new Promise((resolve, reject) => {
    console.log("Sending an email to " + to)
    let template = `<p>Hello There,</p>
                    <p>You have an unread message from an affiliate partner on Connective. Please sign in below and respond to them.<br/>
                    <br/>
                    <p><a href="${process.env.BASE_URL}/auth/signin" role="button"> SIGN IN</a></p>
                    Thanks
                    <br/>
                    <br/>
                    Team Connective</p>`
  
    const msg = {
      to,
      from: 'notifications@connective-app.xyz',
      subject: 'An affiliate partner has sent you a message',
      text: template.replace(/<[^>]*>?/gm, ''),
      html: template,
    }
    sgMail
      .send(msg)
      .then(() => {
        resolve()
      })
      .catch((error) => {
        console.error(error)
      })
  })
}