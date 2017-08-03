var mongoose = require('mongoose');

//-------------- CREATE SCHEMA ----------------------
var issueSchema = new mongoose.Schema({
	summary: String,
	device: String,
	os: String,
	browser: String,
	steps: String,
	completed: Boolean
})

module.exports = mongoose.model("Issue", issueSchema);

//date, image, priority, os_version, browser_version