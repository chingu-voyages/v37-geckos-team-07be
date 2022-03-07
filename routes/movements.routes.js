const User = require('../models/User.model');
const Movement = require('../models/Movement.model');
const router = require('express').Router();
const { ObjectId } = require('mongodb');
const { isAuthenticated } = require('../middleware/jwt.middleware.js');

// @desc    Get all transactions
// @route   GET /api/movements
// @access  Private
/* GET movements ('/api/movements'); */
router.get('/', async (req, res, next) => {
  try {
    const movements = await Movement.find();

    return res.status(200).json({
      success: true,
      user,
      movements,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// @desc    Add movement
// @route   POST /api/movement
// @access  Private
router.post('/', async (req, res, next) => {
  try {
    const { category, amount } = req.body;

    const movements = await Movement.create(req.body);

    return res.status(201).json({
      success: true,
      data: movements,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);

      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error',
      });
    }
  }
});

// @desc    Delete transaction
// @route   DELETE /api/movement/:id
// @access  Private
router.delete('/:id', async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'No transaction found',
      });
    }

    await transaction.remove();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// router.get('/movements', isAuthenticated, async (req, res) => {}
// router.get('/movements/:id', isAuthenticated, async (req, res) => {}
// router.post('/movements', isAuthenticated, async (req, res) => {}
// router.delete('/movements/:id', isAuthenticated, async (req, res) => {}
// router.update('/movements/:id', isAuthenticated, async (req, res) => {}

module.exports = router;
