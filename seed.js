var mongoose = require('mongoose');
var Project = require('./models/projects');
var Issue = require('./models/issues');
var User = require('./models/users');

var data = [{
    title: "Project 1",
    image: "garett-mizunaka-15709.jpg"
}, {
    title: "Project 2",
    image: "garett-mizunaka-15709.jpg"
}, {
    title: "Project 3",
    image: "garett-mizunaka-15709.jpg"
}]
var bug = {
    summary: "the bug summary",
    os: "android",
    device: "mobile",
    browser: "chrome",
    steps: "to this, then that",
    completed: false
}

var dummy = {
    username: "martina",
    password: "password",
    group: "admin"
}

function seedDB() {
    //remove all campgrounds
    User.remove({}, function(err) {
        if (err) return;
        Issue.remove({}, function(err) {
            if (err) { console.log("error") } else {
                Project.remove({}, function(err) {
                    if (err) {
                        console.log("error")
                    } else {
                        //add campground

                        User.register(new User({ username: dummy.username, group: dummy.group }), dummy.password, function(err, user) {
                            if (err) return;
                            console.log("created a user")
                            data.forEach(function(seed) {
                                Project.create(seed, function(err, project) {
                                    if (err) {
                                        console.log("create project error")
                                    } else {
                                        console.log("project created");
                                        Issue.create(bug, function(err, feature) {
                                            if (err) { console.log("error on issue") } else {
                                                project.issues.push(feature);
                                                project.save();
                                                console.log("bug reported");
                                            };
                                        })
                                    }
                                })
                            })

                        })

                    };

                });
            };
        })
    })






}

module.exports = seedDB;