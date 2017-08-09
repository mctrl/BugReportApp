var mongoose = require('mongoose');

//-------------- CREATE SCHEMA ----------------------
var issueSchema = new mongoose.Schema({
	created: {type: Date, default: Date.now},
	summary: String,
	device: String,
	os: String,
	browser: String,
	steps: String,
	completed: Boolean,
	screenshots: Array,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	}
})

module.exports = mongoose.model("Issue", issueSchema);

//date, image, priority, os_version, browser_version