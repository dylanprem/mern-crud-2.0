const express = require('express');
const router = express.Router();
const cors = require('cors');
const moment = require('moment');

// Models
const Cat = require('../../models/Cat');
const { default: axios } = require('axios');

// Routes
router.get('/getCats', cors(), async (req, res) => {
	try {
		if (req.isAuthenticated()) {
			const id = req.user._id;
			const cats = await Cat.find().where('owner').equals(req.user._id);
			if (cats) {
				res.json(cats);
			}
		} else {
			res.status(500).json({ error: 'User is not logged in' });
		}
	} catch (error) {
		console.log(error);
	}
});

router.get('/catApi/getCatImages', cors(), async (req, res) => {
	try {
		const headers = JSON.stringify({
			'content-type': 'application/json',
			'x-api-key': process.env.CAT_API_KEY
		});

		const response = await axios.get('https://api.thecatapi.com/v1/images/search?has_breeds=true', headers);

		res.status(200).json(response.data);
	} catch (error) {
		console.log(error);
	}
});

router.post('/postCats', cors(), async (req, res) => {
	const { name, age, catId, imageURL, info, owner } = req.body;

	const cat = new Cat({
		name: name,
		age: age,
		catId: catId,
		imageURL: imageURL,
		info: info,
		owner: owner,
		affection: 0
	});

	try {
		const response = await cat.save();
		if (response) res.status(200).json(response);
	} catch (error) {
		res.status(400).json(error);
	}
});

router.post('/updateCats/:id', cors(), async (req, res) => {
	try {
		const cat = {
			name: req.body.name,
			age: req.body.age
		};

		const response = await Cat.findByIdAndUpdate(req.params.id.toString().trim(), cat, {
			new: true,
			runValidators: true
		});
		if (response) res.status(200).json(response);
	} catch (error) {
		res.status(400).json(error);
	}
});

router.post('/feedCat/:id', cors(), async (req, res) => {
	try {
		const cat = {
			lastFed: moment(),
			affection: req.body.affection
		};

		const response = await Cat.findByIdAndUpdate(req.params.id.toString().trim(), cat, { new: true });
		if (response) res.status(200).json(response);
	} catch (error) {
		console.log(error);
	}
});

router.post('/playWithCat/:id', cors(), async (req, res) => {
	try {
		const cat = {
			lastPlayed: moment(),
			affection: req.body.affection
		};

		const response = await Cat.findByIdAndUpdate(req.params.id.toString().trim(), cat, { new: true });
		if (response) res.status(200).json(response);
	} catch (error) {
		console.log(error);
	}
});

router.post('/petCat/:id', cors(), async (req, res) => {
	try {
		const cat = {
			lastPets: moment(),
			affection: req.body.affection
		};

		const response = await Cat.findByIdAndUpdate(req.params.id.toString().trim(), cat, { new: true });
		if (response) res.status(200).json(response);
	} catch (error) {
		console.log(error);
	}
});

router.delete('/deleteCats/:id', cors(), async (req, res) => {
	try {
		const response = await Cat.findByIdAndDelete(req.params.id.toString().trim());
		if (response) res.status(200).json(response);
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
