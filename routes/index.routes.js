const router = require('express').Router();

/* GET home page */
router.get('/', async (req, res, next) => {
	res.json('All good in here');
});

module.exports = router;
