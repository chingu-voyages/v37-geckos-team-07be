const User = require('../models/User.model');
const Movement = require('../models/Movement.model');
const router = require('express').Router();
const { ObjectId } = require('mongodb');
/* GET home page */
router.get('/', async (req, res, next) => {
	res.json('All good in here');
});

/* GET Sample user data */
router.get('/sampleData', async (req, res, next) => {
	const user = await User.findOne({
		_id: ObjectId('62154c056065f32a2bdd0aab')
	});
	const movements = await Movement.find({
		userId: ObjectId('62154c056065f32a2bdd0aab')
	});
	res.json({
		user,
		movements
	});
});

module.exports = router;
