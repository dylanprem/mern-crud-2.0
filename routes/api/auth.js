const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
const bcrypt = require('bcryptjs');

// Models
const User = require('../../models/User');

// Routes
router.post('/signup', cors(), async (req, res) => {
	const { username, password } = req.body;

	try {
		const exists = await User.exists({ username: username });

		if (exists) {
			return res.status(400).json({ error: 'Username already exists.' });
		}

		// We handle password validation here since the User Model accepts a hashed password which can be empty.
		// We are using the same object structure as mongoose.
		if (password === '') {
			return res.status(400).json({
				errors: {
					password: {
						message: 'Password is required'
					}
				}
			});
		}

		if (password.length <= 5) {
			return res.status(400).json({
				errors: {
					password: {
						message: 'Password must be at least 6 characters.'
					}
				}
			});
		}

		const newUser = new User({
			username: username,
			password: password,
			cats: []
		});

		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(newUser.password, salt, async (err, hash) => {
				if (err) throw err;
				newUser.password = hash;

				try {
					const response = await newUser.save();

					if (response) {
						return res.status(200).json(response);
					}
				} catch (error) {
					res.status(400).json(error);
				}
			});
		});
	} catch (error) {
		console.log(error);
	}
});

router.post('/login', cors(), async (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return next(err); // will generate a 500 error
		}
		// Generate a JSON response reflecting authentication status
		if (!user) {
			return res.status(401).json({ success: false, error: info });
		}
		req.login(user, function(err) {
			if (err) {
				return next(err);
			}
			console.log('Success');
			return res.status(200).json({ success: true, authenticated: req.isAuthenticated(), user: req.user });
		});
	})(req, res, next);
});

router.get('/getUser', cors(), async (req, res) => {
	console.log(req.user);
	res.status(200).json({ authenticated: req.isAuthenticated(), user: req.user });
});

router.post('/logout', cors(), async (req, res) => {
	req.logout();
	res.status(200).json({ message: 'You are logged out', authenticated: req.isAuthenticated() });
});

module.exports = router;
