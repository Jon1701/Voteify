// Log requests to console.
const morgan = require('morgan');

// Middleware.
const verifyJwt = require('./server/middleware/verifyJsonWebToken');

////////////////////////////////////////////////////////////////////////////////
// Express
////////////////////////////////////////////////////////////////////////////////
const express = require('express');
const app = express();

// Use morgan to log requests to console.
app.use(morgan('dev'));

// Gets parameters from requests.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

////////////////////////////////////////////////////////////////////////////////
// User signup.
////////////////////////////////////////////////////////////////////////////////
const apiRoutes = express.Router();
app.use('/api', apiRoutes);

apiRoutes.post('/signup', require('./server/routes/signup'));

// View poll.
apiRoutes.get('/view/poll/:poll_id', require('./server/routes/view/poll'));

////////////////////////////////////////////////////////////////////////////////
// Protected routes
////////////////////////////////////////////////////////////////////////////////

// Apply the routes within authRoutes with the prefix /auth.
const authRoutes = express.Router();
app.use('/api/auth', authRoutes);

// User login.
authRoutes.post('/login', require('./server/routes/auth/login'));

// Middleware to verify JSON Web Tokens.
authRoutes.use(verifyJwt);

// Base endpoint for the /auth router.
authRoutes.get('/', require('./server/routes/auth/index'));

// Endpoint to create new poll.
authRoutes.post('/create_poll', require('./server/routes/auth/create_poll'));

// Endpoint to cast a vote.
authRoutes.post('/cast_vote', require('./server/routes/auth/cast_vote'));

////////////////////////////////////////////////////////////////////////////////
// Serve files from the ./dist folder.
////////////////////////////////////////////////////////////////////////////////
app.use(express.static('dist'));

////////////////////////////////////////////////////////////////////////////////
// Route to handle errors.
////////////////////////////////////////////////////////////////////////////////
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err);
});

////////////////////////////////////////////////////////////////////////////////
// Server.
////////////////////////////////////////////////////////////////////////////////
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Listening for connections on PORT ' + port);
});
