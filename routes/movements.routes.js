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
    const movements = await Movement.find({
      userId: ObjectId(req.body.userId),
    });

    res.json(movements);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// @desc    Add a new movement
// @route   POST /api/movements
// @access  Private
router.post('/', async (req, res, next) => {
  try {
    const { userId, amount, category, description, isIncome } = req.body;

    const movements = await Movement.create({
      userId,
      amount,
      category,
      description,
      isIncome,
    });

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

///////////////////////////////////////////////////////////
// @desc    Retrieves a specific movement
// @route   GET /api/movements/:id
// @access  Private
// router.get('/:id', (req, res, next) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     res.status(400).json({ message: 'Specified id is not valid' });
//     return;
//   }

//   Project.findById(projectId)
//     .populate('tasks')
//     .then(project => res.status(200).json(project))
//     .catch(error => res.json(error));
// });

// @desc    Update an existing movement
// @route   PUT /api/movements/:id
// @access  Private
router.put('/:id', async (req, res, next) => {
  const { movementId, userId, amount, category, description, isIncome } =
    req.body;

  return Movement.findOneAndUpdate(
    { _id: movementId },
    {
      userId: userId,
      amount: amount,
      category: category,
      description: description,
      isIncome: isIncome,
    },
    { new: true }
  )
    .then(modifiedMovement => {
      if (!!modifiedMovement) {
        res.status(201).json(modifiedMovement);
      } else {
        res.status(404).json({ message: "couldn't find movement" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "couldn't modify the movement" });
    });
});

//////////////////////////////////////////////////////////

// @desc    Delete transaction
// @route   DELETE /api/movements/:id
// @access  Private
router.delete('/:id', async (req, res, next) => {
  try {
    const movement = await Movement.findById(req.params.id);

    if (!movement) {
      return res.status(404).json({
        success: false,
        error: 'No movement found',
      });
    }

    await movement.remove();

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

module.exports = router;
