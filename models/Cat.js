const mongoose = require('mongoose');

module.exports = Cat = mongoose.model('Cat', {
	name: String,
	toys: [ { name: String, quantity: Number } ],
	age: Number,
	hungry: Boolean,
	catId: String,
	imageURL: String,
	date: { type: Date, default: Date.now },
	info: Object
});
