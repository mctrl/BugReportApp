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
var Issue = require('./models/issues');


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
    res.render('landing');
})

app.get('/login', function(req, res) {
    res.render('user/login');
})

app.post('/login', function(req, res) {
    res.send('login post');
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

app.get('/projects/:id/issues', function(req, res) {
    console.log(req.params.id)
    Project.findById(req.params.id).populate("issues").exec(function(err, foundProject) {
        if (err) {
            console.log("didnt't find project")
        } else {
            res.render('issues/show', { foundProject: foundProject });
        }


    })
})

app.post('/projects/:id/issues', function(req, res) {
    console.log(req.params.id)
    var bug = req.body.issue;
    bug.completed = false;
    Project.findById(req.params.id, function(err, project) {
        if (err) {
            console.log(err)
        } else {
            Issue.create(bug, function(err, feature) {
                if (err) {console.log(err)
                } else {

                    project.issues.push(feature);
                    project.save();
                    res.redirect("/projects/"+req.params.id+"/issues")
                }
            })
        }
        // body...
    })

})


app.get('/projects/:id/issues/new', function(req, res) {
    console.log(req.params.id)
    Project.findById(req.params.id, function(err, project) {
        if (err) {
            console.log(err)
        } else {
            res.render("issues/new", { project: project })
        }
    })
})

app.get('/projects/:id/issues/:issueID', function(req, res) {
    console.log(req.params.id, req.params.issueID)
    res.send('projects issue id');
})

app.put('/projects/:id/issues/:issueID', function(req, res) {
    console.log("update issue")
    Issue.findByIdAndUpdate(req.params.issueID, {completed: true} , function(err, foundIssue) {
        if (err) {res.redirect('back')} else {
            // console.log(foundIssue);
            res.redirect('/projects/' + req.params.id + '/issues');
        }
    })
});

app.delete('/projects/:id/issues/:issueID', function(req, res) {
    console.log("delete issue")
    Issue.findByIdAndRemove(req.params.issueID , function(err, foundIssue) {
        if (err) {res.redirect('back')} else {
            // console.log(foundIssue);
            res.redirect('/projects/' + req.params.id + '/issues');
        }
    })
});

//-----------SERVER--------------

app.listen(process.env.PORT, function() {
    console.log("BugReport has started on port", process.env.PORT)
})