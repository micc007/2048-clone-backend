const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: process.env.EMAIL_PORT,
    secure: true,
    service: "Outlook365",
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASS,
    },
    /*
    tls: {
        ciphers:'SSLv3'
    }*/
});

const sendConfirmationMail = (data) => {

let mailOptions = {
    from: '"2048 Clone " <' + process.env.EMAIL_ADDRESS + '>', // sender address
    to: data.destination, // list of receivers
    subject: data.subject, // Subject line
    html: data.html, // html body
    /*
    attachments: [{
        filename: 'erasmuslogo.png',
        path: __dirname + '/img/erazmuslogo.png',
        cid: 'erasmuslogo'
    }]*/
}

transporter.sendMail(mailOptions, (error, info) => {
    if(error){
        return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
});

}
module.exports = {
    transporter,
    sendConfirmationMail
}