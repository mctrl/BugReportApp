var mongoose = require('mongoose');
var Project = require('./models/projects');
// var Camp = require('./models/campgrounds');
// var User = require('./models/users');


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

function seedDB() {
    //remove all campgrounds
    Project.remove({}, function(err) {
        if (err) {
            console.log("error")
        } else {
            //add campground
            data.forEach(function(seed) {
                Project.create(seed, function(err, project) {
                    if (err) {
                        console.log("create project error")
                    } else {
                        console.log("project created");
                    }
                })
            })
        };

    });

}

module.exports = seedDB;