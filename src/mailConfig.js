
export const nodemailer = require('nodemailer');

export const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: 'shopatwhiskybrothers3@outlook.com',
        pass: 'proyectobases2'
    }
  });



export function sendMail(clientMail, body) {
    var mailOptions = {
        from: 'shopatwhiskybrothers3@outlook.com', // sender address (who sends)
        to: clientMail, // list of receivers (who receives)
        subject: 'PURCHASE CONFIRMATION', // Subject line
        text: 'Dear: ' ,  // plaintext body
        html:  body// html body
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
    
        console.log('Message sent: ' + info.response);
      });

  }
