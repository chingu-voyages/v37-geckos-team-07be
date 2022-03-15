// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

const { isAuthenticated } = require('./middleware/jwt.middleware');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require('./config')(app);

const cors = require('cors');
app.use(cors());


// 👇 Start handling routes here

const allRoutes = require('./routes/movements.routes');
// whenever I make a request to:
app.use('/api/movements', isAuthenticated, allRoutes);
// it routes to movements.routes.js => (router.get('/')

const authRouter = require('./routes/auth.routes');
app.use('/auth', authRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
