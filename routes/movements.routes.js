const User = require('../models/User.model');
const Movement = require('../models/Movement.model');
const router = require('express').Router();
const { ObjectId } = require('mongodb');
const { isAuthenticated } = require('../middleware/jwt.middleware.js');

//TODO//TODO//TODO///
// @desc    retrieve categories and some stats from user _id
// @route   GET /api/movements/categories
// @access  Private
router.get('/categories', async (req, res, next) => {
  try {
    //List all the categories ever used by the user
    const allCategories = await Movement.aggregate([
      {
        $match: {
          userId: ObjectId(req.body.userId),
        },
      },
      {
        $project: {
          _id: 0,
          category: 1,
        },
      },
      {
        $group: {
          _id: '$category',
        },
      },
    ]);
    // Calculate the amount total amount of income movements
    const totalIncomeAmount = (
      await Movement.aggregate([
        {
          $match: {
            userId: ObjectId(req.body.userId),
            isIncome: true,
          },
        },
        {
          $project: {
            amount: 1,
          },
        },
        {
          $group: {
            _id: null,
            totalIncomeAmount: { $sum: '$amount' },
          },
        },
      ])
    )[0].totalIncomeAmount;

    // get the categories if income movements with some stats:
    //number of movements, amount sum for category and pecentage rate on total amount
    const incomeCategories = await Movement.aggregate([
      {
        $match: {
          userId: ObjectId(req.body.userId),
          isIncome: true,
        },
      },
      {
        $project: {
          _id: 0,
          category: 1,
          amount: 1,
        },
      },
      {
        $group: {
          _id: '$category',
          movementCount: { $sum: 1 },
          totalCategoryAmount: { $sum: '$amount' },
        },
      },
      {
        $addFields: {
          categoryRate: {
            $divide: ['$totalCategoryAmount', totalIncomeAmount],
          },
        },
      },
    ]);

    //calculate the total amount of expenses movements
    const totalExpenseAmount = (
      await Movement.aggregate([
        {
          $match: {
            userId: ObjectId(req.body.userId),
            isIncome: false,
          },
        },
        {
          $project: {
            amount: 1,
          },
        },
        {
          $group: {
            _id: null,
            totalExpenseAmount: { $sum: '$amount' },
          },
        },
      ])
    )[0].totalExpenseAmount;

    // get the categories if expense movements with some stats:
    //number of movements, amount sum for category and pecentage rate on total amount
    const expenseCategories = await Movement.aggregate([
      {
        $match: {
          userId: ObjectId(req.body.userId),
          isIncome: false,
        },
      },
      {
        $project: {
          _id: 0,
          category: 1,
          amount: 1,
        },
      },
      {
        $group: {
          _id: '$category',
          movementCount: { $sum: 1 },
          totalCategoryAmount: { $sum: '$amount' },
        },
      },
      {
        $addFields: {
          categoryRate: {
            $divide: ['$totalCategoryAmount', totalExpenseAmount],
          },
        },
      },
    ]);

    res
      .status(200)
      .json({ allCategories, incomeCategories, expenseCategories });
  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

// @desc    Get all transactions
// @route   GET /api/movements
// @access  Private
/* GET movements ('/api/movements'); */
router.get('/', async (req, res, next) => {
  console.log(req.payload._id);
  console.log(req.body.userId);
  try {
    const movements = await Movement.find({
      userId: ObjectId(req.payload._id),
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
    const { amount, category, description, isIncome } = req.body;
    const userId = req.payload._id;

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

// @desc    Retrieves a specific movement
// @route   GET /api/movements/:id
// @access  Private
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  Movement.findById(id)
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

// @desc    Update an existing movement
// @route   PUT /api/movements/:id
// @access  Private
router.put('/:id', async (req, res, next) => {
  const { movementId, userId, amount, category, description, isIncome } =
    req.body;

  return Movement.findOneAndUpdate(
    { id: movementId },
    {
      userId,
      amount,
      category,
      description,
      isIncome,
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

//////////////////////////////////////////////////////////////////////

module.exports = router;
