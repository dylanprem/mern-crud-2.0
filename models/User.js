const mongoose = require('mongoose');

module.exports = User = mongoose.model('User', {
	username: String,
	password: String,
	cats: [ Array ],
	date: { type: Date, default: Date.now }
});
