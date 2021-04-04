const nodemailer = require('nodemailer')

const sendMailToUser = async function (to, subject, body) {
    let isSucc = true
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD
        }
    })
    await transporter.sendMail({
        from: 'From who',
        to: to,
        subject: subject,
        text: body
    }, (error, info) => {
        if (error) {
            console.log(error)
            isSucc = false
        }
        transporter.close()
    })
    return isSucc
}

module.exports = {sendMailToUser}