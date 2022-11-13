
export const nodemailer = require('nodemailer');
const { jsPDF } = require("jspdf"); 

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
    const doc = new jsPDF();
    doc.text("Hello world!", 10, 10);
    doc.save("a4.pdf"); 

    var mailOptions = {
        from: 'shopatwhiskybrothers3@outlook.com', // sender address (who sends)
        to: clientMail, // list of receivers (who receives)
        subject: 'PURCHASE CONFIRMATION', // Subject line
        text: 'Facturita: ' ,  // plaintext body
        attachments: [{
            filename: 'a4.pdf',
            path: './a4.pdf',
            contentType: 'application/pdf'
          }],
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
    
        console.log('Message sent: ' + info.response);
      });

  }
