import nodemailer from 'nodemailer'

export const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ahmedshoura279@gmail.com",
            pass: 'jcup ltbp dpef xrug'
        }
    })
    await transporter.sendMail({
        to,
        from: "'<e-commerce-hti-g1>'ahmedshoura279@gmail.com",
        subject,
        html
    })
}