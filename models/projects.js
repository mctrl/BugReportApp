var mongoose = require('mongoose');

//-------------- CREATE SCHEMA ----------------------
var projectSchema = new mongoose.Schema({
	title: String,
	image: String
})

module.exports = mongoose.model("Project", projectSchema);