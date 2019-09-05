var express             = require("express");
var methodOverride      = require("method-override");
var nodemailer          = require("nodemailer");
var bodyParser          = require("body-parser");
var expressSanitizer    = require("express-sanitizer");
var flash               = require("connect-flash");

var app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());

app.use(require("express-session")({
    secret: "Nicolas Cage is the best",
    resave: false,
    saveUninitialized: false
}));

app.use(function(req, res, next){
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success");
   next();
});


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
            user: process.env.EMAILUSER, // generated ethereal user
            pass: process.env.EMAILPASSWORD  // generated ethereal password
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
            req.flash("error", "Looks like that message did not go through for some reason, Feel free to email me directly at bingham.stuart@gmail.com with your questions")
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        req.flash("success", "Thanks for reaching out! I'll get back to you at your provided email address as soon as I can.");
        res.redirect("/");
    });
});

app.get("/resume", function(req, res){
      res.render("resume")
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started");
});
