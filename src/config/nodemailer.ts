import nodemailer from 'nodemailer'

const configMailer = () =>{
    return {
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "d1e54f4b156c8a",
          pass: "8f7701730d2197"
        }
      }
}


export const transporter = nodemailer.createTransport(configMailer())