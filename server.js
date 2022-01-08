const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const uri = `${process.env.MONGODB_URI}`;
const MongoStore = require('connect-mongo');

// Models
const User = require('./models/User');

main().catch((err) => console.log(err));

async function main() {
	try {
		const connection = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

		if (connection) {
			console.log('MongoDB Connected');
		}
	} catch (error) {
		console.log(error);
	}
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1); // trust first proxy
app.use(
	session({
		secret: 'cats',
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			maxAge: 3600000 //1 hour
		},
		store: MongoStore.create({
			mongoUrl: process.env.MONGODB_URI,
			collectionName: 'sessions',
			ttl: 14 * 24 * 60 * 60
		})
	})
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
	new LocalStrategy(async function verify(username, password, done) {
		const exists = await User.exists({ username: username });

		if (!exists) {
			return done(null, false, { message: 'Incorrect username.', field: 'username' });
		}

		try {
			const user = await User.findOne({ username: username });
			const isMatch = await bcrypt.compare(password.toString().trim(), user.password);

			if (!isMatch) {
				return done(null, false, { message: 'Incorrect password.', field: 'password' });
			}

			return done(null, user);
		} catch (error) {
			return done(error);
		}
	})
);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// routes
const catRoutes = require('./routes/api/cat');
const userRoutes = require('./routes/api/auth');
app.use('/api/cat', catRoutes);
app.use('/api/auth', userRoutes);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

//Server static assets if in production
if (process.env.NODE_ENV === 'production') {
	// Set static folder
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}
