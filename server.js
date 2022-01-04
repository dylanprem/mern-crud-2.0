const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');

// Middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(
	session({
		secret: 'cats',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());

// mongodb
const mongoose = require('mongoose');
const uri = `${process.env.MONGODB_URI}`;

// routes
const catRoutes = require('./routes/api/cat');
const userRoutes = require('./routes/api/auth');
app.use('/api/cat', catRoutes);
app.use('/api/auth', userRoutes);

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

//Server static assets if in production
if (process.env.NODE_ENV === 'production') {
	// Set static folder
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
