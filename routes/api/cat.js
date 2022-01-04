const express = require('express');
const router = express.Router();
const cors = require('cors');

// Models
const Cat = require('../../models/Cat');
const { default: axios } = require('axios');

// Routes
router.get('/getCats', cors(), async (req, res) => {
	try {
		const cats = await Cat.find();
		res.json(cats);
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
	const { name, toys, age, hungry, catId, imageURL } = req.body;

	const cat = new Cat({
		name: name,
		toys: toys,
		age: age,
		hungry: hungry,
		catId: catId,
		imageURL: imageURL
	});
	try {
		const response = await cat.save();
		if (response) res.status(200).json(response);
	} catch (error) {
		console.log(error);
	}
});

router.post('/updateCats/:id', cors(), async (req, res) => {
	try {
		const cat = {
			name: req.body.name,
			age: req.body.age,
			hungry: req.body.hungry
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
