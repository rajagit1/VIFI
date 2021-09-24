const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
admin.initializeApp();

/**
* Here we're using Gmail to send 
*/
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'viabilityfilm@gmail.com',
        pass: 'shirdi12345#'
    }
});

exports.sendMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      
        // getting dest email by query string
        const dest = req.query.dest;
        console.log("dest:::",dest);
        const body = req.query.body;
        console.log("body:::",body);
        const mailOptions = {
            from: 'ViFi Team <viabilityfilm@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
            to: dest,
            subject: 'Forgot Password Mail from VIFI Team', // email subject
            html: `<p style="font-size: 16px;">`+body+`</p>
                <br />
               
                <b>
                Thanks & Regards,<br>
                ViFi Team
                </b><br />
                <img src="https://firebasestorage.googleapis.com/v0/b/app-quick-direct.appspot.com/o/vifilogo.png?alt=media&token=119e64aa-0f8b-435c-9ce8-89882c2ccc9b" />
            ` // email content in HTML
        };
  
        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if(erro){
                return res.send(erro.toString());
            }
            return res.send('Mail sent');
        });
    });    
});