var express = require('express');
var nodemailer = require('nodemailer');

var app = express();
var emailRouter = express.Router();

var transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    auth: {
        user: '',
        pass: ''
    }
});

emailRouter.route('/').post((req, res) => {
    console.log('sending email...');
    var name = req.body.name;
    var email = req.body.email;
    var message = req.body.message;
    var mailOptions = {
        from: 'hello@telosfoundation.io',
        to: 'hello@telosfoundation.io',
        subject: 'Email from ' + name + ' email: ' + email + ' | Telos Foundation website',
        text: message
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.json('Error while sending email. ' + error);
        } else {
            console.log('Email sent: ' + info.response);
            res.json('Email sent!');
        }
    });
});

module.exports = emailRouter;