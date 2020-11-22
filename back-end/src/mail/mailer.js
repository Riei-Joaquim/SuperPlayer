const nodemailer = require('nodemailer');
const config = require('../config/auth.json');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const transport = nodemailer.createTransport(config.email);

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