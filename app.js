var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var LocalStrategy = require('passport-local');
var passport = require('passport');
var expressSession = require('express-session');
var passportLocalMongoose = require('passport-local-mongoose');
var methodOverride = require('method-override');
var flash = require('connect-flash');

// var seedDB = require('./seed');


//-------------- CONNECT TO MONGODB -----------------
mongoose.connect(process.env.BUGREPORTDB);

// ------------- SETUPS ----------------------------
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressSession({
    secret:"This is my secret",
    resave: false,
    saveUninitialized: false
}))

app.use(flash());
app.use(methodOverride("_method"))

//-----------ROUTES--------------
 
app.get('/', function (req, res) {
  res.render('landing.ejs');
})

//-----------SERVER--------------

app.listen(process.env.PORT, function() {
	console.log("BugReport has started on port", process.env.PORT)
})
