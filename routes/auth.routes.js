const express = require('express');

// ℹ️ Handles password encryption
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Require the User model in order to interact with the database
const User = require('../models/User.model');
const Session = require('../models/Session.model');

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require('../middleware/isLoggedOut');
const isLoggedIn = require('../middleware/isLoggedIn');

const router = express.Router();
const saltRounds = 10;

router.get('/session', (req, res) => {
  // we don't want to throw an error, and just maintain the user as null
  if (!req.headers.authorization) {
    return res.json(null);
  }

  // accessToken is being sent on every request in the headers
  const accessToken = req.headers.authorization;

  Session.findById(accessToken)
    .populate('user')
    .then(session => {
      if (!session) {
        return res.status(404).json({ errorMessage: 'Session does not exist' });
      }
      return res.status(200).json(session);
    });
});

/* ------- SIGNUP ---------- */
// POST /auth/signup  - Creates a new user in the database
router.post('/signup', isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body;

  // Check if email or password or name are provided as empty string
  if (email === '' || password === '' || username === '') {
    res.status(400).json({ message: 'Provide email, password and name' });
    return;
  }

  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Provide a valid email address.' });
    return;
  }

  // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.',
    });
    return;
  }

  // Check the users collection if a user with the same email already exists
  User.findOne({ email }).then(foundUser => {
    // If the user with the same email already exists, send an error response
    if (foundUser) {
      res.status(400).json({ message: 'User already exists.' });
      return;
    }

    // If email is unique, proceed to hash the password
    return bcrypt
      .genSalt(saltRounds)
      .then(salt => bcrypt.hash(password, salt))
      .then(hashedPassword => {
        // Create a user and save it in the database
        return User.create({
          username,
          password: hashedPassword,
        });
      })
      .then(user => {
        Session.create({
          user: user._id,
          createdAt: Date.now(),
        }).then(session => {
          res.status(201).json({ user, accessToken: session._id });
        });
      })
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).json({
            errorMessage:
              'Username need to be unique. The username you chose is already in use.',
          });
        }
        return res.status(500).json({ errorMessage: error.message });
      });
  });
});

/* ------------ LOGIN ------------ */

// POST  /auth/login - Verifies username and password and returns a JWT
router.post('/login', isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    return res
      .status(400)
      .json({ errorMessage: 'Please provide your username.' });
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res.status(400).json({
      errorMessage: 'Your password needs to be at least 8 characters long.',
    });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username })
    .then(user => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res.status(400).json({ errorMessage: 'Wrong credentials.' });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then(isSamePassword => {
        if (!isSamePassword) {
          return res.status(400).json({ errorMessage: 'Wrong credentials.' });
        }
        Session.create({ user: user._id, createdAt: Date.now() }).then(
          session => {
            return res.json({ user, accessToken: session._id });
          }
        );
      });
    })

    .catch(err => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});

/* ------------ LOGOUT ------------ */

router.delete('/logout', isLoggedIn, (req, res) => {
  Session.findByIdAndDelete(req.headers.authorization)
    .then(() => {
      res.status(200).json({ message: 'User was logged out' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: err.message });
    });
});

module.exports = router;
