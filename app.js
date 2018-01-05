var express = require("express");
var methodOverride = require("method-override");
var nodemailer = require("nodemailer");
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");

var app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
    
app.get("/", function(req, res){
      res.render("stuart")
});

app.post("/contact", function(req, res){
    // console.log(req.body.contact);
    // res.redirect("/");
    var output = "<p>New contact request from " + req.body.contact.name + " at " + req.body.contact.email + "</p> <p>message: " + req.body.contact.message + "</p>";
    
     // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "stuart@stuartbingham.net", // generated ethereal user
            pass: "C0atofArms44"  // generated ethereal password
        },
        tls:{
            rejectUnauthorized:false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Paralax" <stuart@stuartbingham.net>', // sender address
        to: 'bingham.stuart@gmail.com', // list of receivers
        subject: "New Contact from your portfolio", // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.redirect("/");
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started");
});
