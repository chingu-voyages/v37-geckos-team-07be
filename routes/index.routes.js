const User = require('../models/User.model');
const Movement = require('../models/Movement.model');
const router = require('express').Router();
const { ObjectId } = require('mongodb');
const { isAuthenticated } = require('./../middleware/jwt.middleware.js');

/* GET home page */
router.get('/', async (req, res, next) => {
  res.json('All good in here');
});

/* GET Sample user data */
router.get('/sampleData', isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: ObjectId('62154c056065f32a2bdd0aab'),
    });

    const movements = await Movement.find({
      userId: ObjectId('62154c056065f32a2bdd0aab'),
    });

    res.status(200).json({
      user,
      movements,
    });
  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

/* GET Get User data from user _id */
router.get('/userData/:id', isAuthenticated, async (req, res, next) => {
  // const { userId } = req.body;
  // const userId = req.params.id;
  const userId = '';
  try {
    const user = await User.findOne({
      _id: ObjectId(userId),
    });

    res.json(user);
  } catch (err) {
    console.log(err);
    req.status(404);
  }
});

/* GET Get Movement data from user _id */
router.get('/movementsData', isAuthenticated, async (req, res, next) => {
  try {
    const movements = await Movement.find({
      userId: ObjectId(req.body.userId),
    });

    res.json(movements);
  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

/* GET Get categories and some stats of them from user _id */
router.get('/categories', isAuthenticated, async (req, res, next) => {
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

/* POST add new movement */
router.post('/addMovement', isAuthenticated, (req, res, next) => {
  const { userId, amount, category, description, isIncome } = req.body;

  return Movement.create({ userId, amount, category, description, isIncome })
    .then(newMovement => {
      res.status(201).json(newMovement);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "couldn't add the movement" });
    });
});

/* PUT update existing movement */
router.put('/updateMovement', isAuthenticated, async (req, res, next) => {
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

// router.get('/movements', isAuthenticated, async (req, res) => {}
// router.get('/movements/:id', isAuthenticated, async (req, res) => {}
// router.post('/movements', isAuthenticated, async (req, res) => {}
// router.delete('/movements/:id', isAuthenticated, async (req, res) => {}
// router.update('/movements/:id', isAuthenticated, async (req, res) => {}

router.post('/deleteMovement', isAuthenticated, async (req, res) => {
  console.log(req.body);
  return Movement.findOneAndDelete({ _id: req.body.id })
    .then(deletedMovement => {
      res.status(200).json(deletedMovement);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "couldn't delete movement" });
    });
});

module.exports = router;
