const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Models
const User = require('../../models/User');

passport.use(
	new LocalStrategy(async function verify(username, password, cb) {
		const exists = await User.exists({ username: username });

		if (!exists) {
			return cb(null, false, { message: 'Incorrect username or password.' });
		} else {
			try {
				const user = await User.findOne({ username: username });
				const isMatch = await bcrypt.compare(password, user.password);
				return cb(null, user);
			} catch (error) {
				console.log(error);
				return cb(null, false, { message: 'Incorrect username or password.' });
			}
		}
	})
);

// Serialized and deserialized methods when got from session
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

// Routes
router.post('/signup', cors(), async (req, res) => {
	const { username, password } = req.body;

	try {
		const exists = await User.exists({ username: username });

		if (exists) {
			return res.status(400).json({ error: 'Username already exists' });
		}

		const newUser = new User({
			username: username,
			password: password,
			cats: []
		});

		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(newUser.password, salt, (err, hash) => {
				if (err) throw err;
				newUser.password = hash;
			});
		});

		const response = await newUser.save();

		if (response) {
			return res.status(200).json(response);
		}
	} catch (error) {
		console.log(error);
	}
});

router.post('/login', cors(), passport.authenticate('local', { failureMessage: true }), async (req, res) => {
	req.res.status(200).json({ authenticated: req.isAuthenticated() });
});

router.get('/test', cors(), async (req, res) => {
	res.status(200).json({ test: 'Auth route test', authenticated: req.isAuthenticated() });
});

router.post('/logout', cors(), async (req, res) => {
	req.logout();
	res.status(200).json({ message: 'You are logged out', authenticated: req.isAuthenticated() });
});

module.exports = router;
