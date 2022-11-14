
export const nodemailer = require('nodemailer');
const { jsPDF } = require("jspdf");

// Require the package
const QRCode = require('qrcode')

export function createQr(data) {
    // Creating the data


    // Converting the data into String format
    let stringdata = JSON.stringify(data)

    // Print the QR code to terminal
    QRCode.toString(stringdata, { type: 'terminal' },
        function (err, QRcode) {

            if (err) return console.log("error occurred")

            // Printing the generated code
            //console.log(QRcode)
        })

    // Converting the data into base64
    QRCode.toFile("qr.jpeg", stringdata, function (err) {
        if (err) return console.log("error occurred")
    })
}



export const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: 'shopatwhiskybrothers3@outlook.com',
        pass: 'proyectobases2'
    }
});



var fs = require('fs');

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}


export function sendMail(clientMail) {
    //createQr();
    var img = base64_encode('qr.jpeg');

    const doc = new jsPDF();
    doc.text("OTROOOO!", 10, 10);
    doc.addImage(img, 'JPEG', 10, 40, 180, 180);
    doc.save("a4.pdf");

    /*
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
      });*/

}
