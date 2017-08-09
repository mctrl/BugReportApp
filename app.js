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
var moment = require('moment');
var multer = require('multer');
//var upload = multer({ dest: './public/img/' });


// var storage = multer.diskStorage({
//     filename: function(req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// })

// fileFilter: ( req, file, cb ) => {
//         cb( null, file.mimetype == 'image/jpeg' )
// },

function checkForImg(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
}

// var storage = multer.diskStorage({
  //filename: function (req, file, cb) {
    //console.log(file);
    // crypto.pseudoRandomBytes(16, function (err, raw) {
    //   if (err) return cb(err)

    //   cb(null, raw.toString('hex') + path.extname(file.originalname))
    // })
  //}

//     filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })

// var upload = multer({ dest: './public/img/', storage: storage }).single('project[image]')


var Project = require('./models/projects');
var Issue = require('./models/issues');
var User = require('./models/users');
var Group = require('./models/groups')

var seedDB = require('./seed');

// seedDB();


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

app.locals.moment = moment;

//-------------PASSPORT SETUP---------------
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    // res.locals.error = req.flash('error');
    // res.locals.success = req.flash('success');
    next();
})



//-----------ROUTES--------------

app.get('/', function(req, res) {
    res.render('landing');
})

app.get('/login', function(req, res) {
    res.render('user/login');
})

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    // failureFlash: 'Unsuccessful login'
}), function(req, res) {
    // req.flash('success', 'Welcome back ' + req.user.username);
    res.redirect('/projects')
})

app.get('/logout', function(req, res) {
    req.logout();
    // req.flash('success', "You logged out")
    res.redirect('/')
})

app.get('/projects', isLoggedIn, function(req, res) {
    var userGroup = req.user.group;
    if (userGroup != "dev" && userGroup != "admin") {
        Project.find({ group: userGroup }).populate("issues").exec(function(err, projects) {
            if (err) {
                console.log("cannot retrieve projects");
                console.log(err);
            } else {
                res.render('projects/show', {
                    projects: projects
                });
            }
        })

    } else {
        Project.find().populate("issues").exec(function(err, projects) {
            if (err) {
                console.log("cannot retrieve projects");
                console.log(err);
            } else {
                // console.log(projects)
                res.render('projects/show', {
                    projects: projects
                });
            }
        })
    }

})

app.post('/projects', isLoggedIn, function(req, res) {
    // res.send('projects new');
    // app.use(multer({ dest: './public/img/'}));
    var upload = multer({ dest: './public/img/', fileFilter: checkForImg }).single('project[image]')

    upload(req,res, function(err) {
        if(err) {
            console.log("error")
        } else {
            console.log('Everything went fine');
            // Everything went fine
            //console.log(req.body);
            // console.log(req.file); 
            var project =  req.body.project;
            project.image = req.file.filename;
            Project.create(project, function(err, project) {
                if (err) {
                    console.log("Something went wrong")
                } else {

                    console.log("we just added a project")
                    // console.log(camp);
                    res.redirect('/projects');
                }
            })
        }
    })


    //console.log(req);

})

app.get('/projects/new', isLoggedIn, function(req, res) {
    // res.send('projects new');
    Group.find({}, function(err, groups) {
        if (err) { res.redirect('back') } else {
            res.render('projects/new', { groups: groups });
        };
    })

})

app.get('/projects/:id/issues', isLoggedIn, function(req, res) {
    // console.log(req.params.id)
    Project.findById(req.params.id).populate("issues").exec(function(err, foundProject) {
        if (err) {
            console.log("didnt't find project")
        } else {
            res.render('issues/show', { foundProject: foundProject });
        }


    })
})

app.post('/projects/:id/issues', isLoggedIn, function(req, res) {
    var upload = multer({ dest: './public/screenshots/', fileFilter: checkForImg }).array('issue[screenshots]')
    // console.log(req.params.id)
    upload(req,res, function(err) {
        if(err) {
            console.log("error")
        } else {
            console.log('Everything went fine');
            // Everything went fine
            //console.log(req.body);
            //console.log(req.files); 
            var screens = req.files;
            var bug = req.body.issue;
            bug.completed = false;
            bug.screenshots = [];
            bug.author = {
                id: req.user._id,
                username: req.user.username
            }
            for (var i = 0; i < screens.length; i++) {
                bug.screenshots.push(screens[i].filename);
            };
            Project.findById(req.params.id, function(err, project) {
                if (err) {
                    console.log(err)
                } else {
                    Issue.create(bug, function(err, feature) {
                        if (err) {
                            console.log(err)
                        } else {
                            project.issues.push(feature);
                            project.save();
                            res.redirect("/projects/" + req.params.id + "/issues")
                        }
                    })
                }
            })
        }
    })

})

app.get('/projects/:id/issues/new', isLoggedIn, function(req, res) {
    // console.log(req.params.id)
    Project.findById(req.params.id, function(err, project) {
        if (err) {
            console.log(err)
        } else {
            res.render("issues/new", { project: project })
        }
    })
})

app.get('/projects/:id/issues/:issueID', isLoggedIn, function(req, res) {
    // console.log(req.params.id, req.params.issueID)
    Issue.findById(req.params.issueID, function(err, foundIssue) {
        if (err) return;
        res.send(foundIssue);
    })
})

app.put('/projects/:id/issues/:issueID', function(req, res) {
    console.log("update issue")
    Issue.findByIdAndUpdate(req.params.issueID, { completed: true }, function(err, foundIssue) {
        if (err) { res.redirect('back') } else {
            // console.log(foundIssue);
            res.redirect('/projects/' + req.params.id + '/issues');
        }
    })
});

app.delete('/projects/:id/issues/:issueID', function(req, res) {
    console.log("delete issue")
    Issue.findByIdAndRemove(req.params.issueID, function(err, foundIssue) {
        if (err) { res.redirect('back') } else {
            // console.log(foundIssue);
            res.redirect('/projects/' + req.params.id + '/issues');
        }
    })
});

//-----------SERVER--------------

app.listen(process.env.PORT, function() {
    console.log("BugReport has started on port", process.env.PORT)
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    };
    // req.flash('error', "You need to be logged in to do that")
    res.redirect('/login');
}