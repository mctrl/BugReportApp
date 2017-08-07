var mongoose = require('mongoose');

//-------------- CREATE SCHEMA ----------------------
var groupSchema = new mongoose.Schema({
	name: String
})

module.exports = mongoose.model("Group", groupSchema);