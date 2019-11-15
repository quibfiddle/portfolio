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

app.get("/.well-known/acme-challenge/I_BF_UCVrmAcrrmIqKP_2MZcPsWkYkuNU4VCG5wyp6Y", function(req, res){
      res.send("I_BF_UCVrmAcrrmIqKP_2MZcPsWkYkuNU4VCG5wyp6Y.agX3oqzLnj_wkShCF8ByhoBhIwNUkexMnNo0b8TBF-w")
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started");
});
