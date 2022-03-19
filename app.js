// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

const isLoggedIn = require('../server/middleware/isLoggedIn');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require('./config')(app);

// 👇 Start handling routes here

// whenever I make a request to:

// it routes to movements.routes.js => (router.get('/')

const movementsRouter = require('./routes/movements.routes');
app.use('/api', isLoggedIn, movementsRouter);

const authRouter = require('./routes/auth.routes');
app.use('/auth', authRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
