var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


//-------------- CREATE SCHEMA ----------------------
var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	group: String
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);