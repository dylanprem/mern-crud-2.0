const mongoose = require('mongoose');

const CatSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [ true, 'Cats name is required.' ]
	},
	age: {
		type: Number,
		required: [ true, 'Age is required.' ],
		min: [ 1, 'Age must be at least 1 year old.' ],
		max: [ 38, 'Age cannot be greater than 38 years old (the oldest cat in history).' ]
	},
	catId: String,
	imageURL: String,
	date: { type: Date, default: Date.now },
	info: Object,
	lastFed: { type: Date, default: Date.now },
	owner: mongoose.SchemaTypes.ObjectId,
	affection: Number,
	lastPlayed: { type: Date, default: Date.now },
	lastPets: { type: Date, default: Date.now }
});

module.exports = Cat = mongoose.model('Cat', CatSchema);
