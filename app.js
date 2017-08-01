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

var Project = require('./models/projects');


var seedDB = require('./seed');

seedDB();


//-------------- CONNECT TO MONGODB -----------------
mongoose.connect(process.env.BUGREPORTDB);

// ------------- SETUPS ----------------------------
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressSession({
    secret: "This is my secret",
    resave: false,
    saveUninitialized: false
}))

app.use(flash());
app.use(methodOverride("_method"))

//-----------ROUTES--------------

app.get('/', function(req, res) {
    res.render('landing.ejs');
})

app.get('/projects', function(req, res) {
    Project.find({}, function(err, projects) {
        if (err) {
            console.log("cannot retrieve projects");
            console.log(err);
        } else {
            res.render('projects/show', {
                projects: projects
            });
        }
    })
})

app.post('/projects', function(req, res) {
    // res.send('projects new');
    Project.create(req.body.project, function(err, camp) {
        if (err) {
            console.log("Something went wrong")
        } else {

            console.log("we just added a project")
            // console.log(camp);
            res.redirect('/projects');
        }
    })
})

app.get('/projects/new', function(req, res) {
    // res.send('projects new');
    res.render('projects/new');
})

app.get('/projects/:id/issue', function(req, res) {
    console.log(req.params.id)
    res.send('projects issue');
})

app.get('/projects/:id/issue/new', function(req, res) {
    console.log(req.params.id)
    res.send('projects issue new');
})

app.get('/projects/:id/issue/:issueID', function(req, res) {
    console.log(req.params.id, req.params.issueID)
    res.send('projects issue id');
})


//-----------SERVER--------------

app.listen(process.env.PORT, function() {
    console.log("BugReport has started on port", process.env.PORT)
})