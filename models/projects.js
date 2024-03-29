var mongoose = require('mongoose');

//-------------- CREATE SCHEMA ----------------------
var projectSchema = new mongoose.Schema({
	title: String,
	image: String,
	issues: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Issue"
	}],
	group: String
})

module.exports = mongoose.model("Project", projectSchema);