import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
})

export const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'cybrainfoxy@gmail.com',
}
