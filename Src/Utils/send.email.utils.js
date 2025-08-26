import nodemailer from "nodemailer";
import { EventEmitter } from "node:events";



export const sendEmail = async (
    {
        to,
        subject,
        cc = process.env.USER_EMAIL,
        content,
        attachments = []    
    
    }
) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user:process.env.USER_EMAIL,
            pass:process.env.USER_PASSWORD,
        },
        tls:{
            rejectUnauthorized:false
        }
    });

    const info = await transporter.sendMail({
        from: process.env.USER_EMAIL,
        to,
        subject,
        cc,
        html:content,
        attachments,
    
    });
console.log('info',info);
return info;
    };



export const eventEmitter = new EventEmitter();


eventEmitter.on("emailSent",(args) => {
    console.log("sending email event is started");
    sendEmail(args)
})


