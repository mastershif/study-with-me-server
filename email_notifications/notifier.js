const nodemailer = require("nodemailer");

const emailNotifier = (mailOptions) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false, // true for 465, false for other ports
        port: 25,
        requireTLS: true,
        auth: {
            user: process.env.SERVER_EMAIL_ADDRESS, // generated ethereal user
            pass: process.env.SERVER_EMAIL_PASSWORD, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    if (mailOptions.to.length > 1) {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Messages Sent!');
        });
    } else {
        console.log('No recepients in this group');
    }

}

module.exports = emailNotifier;