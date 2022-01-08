const mongoose = require('mongoose');

module.exports = User = mongoose.model('User', {
	username: {
		type: String,
		required: [ true, 'Username is required.' ],
		minLength: [ 6, 'Username must be at least 6 characters.' ],
		maxLength: [ 20, 'Username cannot be more than 20 characters.' ]
	},
	password: {
		type: String,
		required: [ true, 'Password is required.' ]
	},
	date: { type: Date, default: Date.now }
});
