const nodemailer = require("nodemailer");
const { smtpUsername, smtpPassword } = require("../secrect");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: smtpUsername,
      pass: smtpPassword,
    },
  });

  const sendMailWithNodeMailer=async(emailData)=>{
    try {
        const mailOption={
            from: smtpUsername, // sender address
            to: emailData.email, // list of receivers
            subject: emailData.subject, // Subject line
            text: "ISLLC", // plain text body
            html: emailData.html, // html body
        }
        const info=await transporter.sendMail(mailOption);
        console.log("message send %s",info.response);
    } catch (error) {
        console.error("error occue while sending message",error);
        throw error;
    }


  }
  module.exports={sendMailWithNodeMailer}