import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port:465,
    debug:true,
    requireTLS:true,
    connectionTimeout:10000,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS
    }
})


export default transporter;