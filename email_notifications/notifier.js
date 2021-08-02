const nodemailer = require("nodemailer");

const emailNotifier = (mailOptions) => {
    let transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: process.env.SERVER_EMAIL_ADDRESS,
            pass: process.env.SERVER_EMAIL_PASSWORD,
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