import {mailOptions, transporter} from 'services/nodemailer'
const handler = async (req, res) =>{

    const data = req.body.data
    if(req.method === 'POST') {
        
        try {
            await transporter.sendMail({
                ...mailOptions,
                subject: data.subject,
                text: data.msg.replace(/<[^>]*>?/gm, ''),
                html: data.msg
            })
            res.status(200).json({success: true})
        } catch (error) {
            res.status(422).json({success: false, message: error.message})
    
        }
    }
 }

 export default handler