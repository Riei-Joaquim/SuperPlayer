const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

let mailHost = process.env.MAIL_HOST;
let mailPost = process.env.MAIL_PORT;
let mailUser = process.env.MAIL_USER;
let mailPass = process.env.MAIL_PASS;

if(!mailHost || !mailPost || !mailUser || !mailPass){
    const config = require('../config/auth.json');
    mailHost = config.email.host;
    mailPost = config.email.port;
    mailUser = config.email.auth.user;
    mailPass = config.email.auth.pass;
}

const transport = nodemailer.createTransport({
    host: mailHost,
    port: mailPost,
    auth: {
        user: mailUser,
        pass: mailPass
    }
});

transport.use(
    'compile',
    hbs({
        viewEngine:{
            defaultLayout:undefined,
            partialsDir:path.resolve('./src/mail/'),
        },
        viewPath:path.resolve('./src/mail/'),
        extName: '.html',
    })
);

module.exports = transport;