var express             = require("express");

// var methodOverride      = require("method-override");
// var nodemailer          = require("nodemailer");
// var bodyParser          = require("body-parser");
// var expressSanitizer    = require("express-sanitizer");
// var flash               = require("connect-flash");

var app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// app.use(expressSanitizer());
// app.use(flash());

// app.use(require("express-session")({
//     secret: "Nicolas Cage is the best",
//     resave: false,
//     saveUninitialized: false
// }));

app.get("/", function(req, res){
      res.render("stuart")
});

app.get("/resume", function(req, res){
      res.render("resume")
});

app.listen(process.env.port, process.env.IP, function(){
    console.log("server has started");
});
