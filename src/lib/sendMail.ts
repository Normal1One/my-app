import nodemailer from 'nodemailer'

type sendEmailOptions = {
    to: string
    subject: string
    text: string
}

export const sendEmail = ({ to, subject, text }: sendEmailOptions) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD
        }
    })

    transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html: text
    })
}
