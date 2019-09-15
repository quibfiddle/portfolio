var express             = require("express");

var app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));


app.use(require("express-session")({
    secret: "Nicolas Cage is the best",
    resave: false,
    saveUninitialized: false
}));

app.get("/", function(req, res){
      res.render("stuart")
});


app.get("/resume", function(req, res){
      res.render("resume")
});

app.get("/.well-known/acme-challenge/5KBBsqOZDE0mVfMYWzgI59PY9pQ08z7cidOX5Z_w8wU", function(req, res){
      res.render("letsencrypt")
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started");
});
