////////////////////////////////////////////////////////////////////////////////
// Dependencies
////////////////////////////////////////////////////////////////////////////////
const rfr = require('rfr');       // Root relative paths.
const morgan = require('morgan'); // Log requests to console.
const verifyJwt = rfr('/server/middleware/verifyJsonWebToken'); // Authentication middleware.
const cors = require('cors'); // Cross-origin requests.

////////////////////////////////////////////////////////////////////////////////
// Express
////////////////////////////////////////////////////////////////////////////////
const express = require('express');
const app = express();

// Allow cross origin requests.
app.use(cors({
  origin: 'http://localhost:8080'
}));

// Use morgan to log requests to console.
app.use(morgan('dev'));

// Gets parameters from requests.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

////////////////////////////////////////////////////////////////////////////////
// Routers
////////////////////////////////////////////////////////////////////////////////
const apiRoutes = express.Router();
const authRoutes = express.Router();

app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

////////////////////////////////////////////////////////////////////////////////
// Unauthenticated routes: /api
////////////////////////////////////////////////////////////////////////////////

// User signup
apiRoutes.post('/signup', rfr('/server/routes/api/signup'));

// View poll
apiRoutes.get('/view/poll/:poll_id', rfr('/server/routes/api/view/poll'));

// Batch get list of recent polls.
apiRoutes.get('/view/recent_polls/:page_num', rfr('/server/routes/api/view/recent_polls'));

// Batch get list of user recent polls
apiRoutes.get('/view/recent_user_polls/:username/:page_num', rfr('/server/routes/api/view/recent_user_polls'));

////////////////////////////////////////////////////////////////////////////////
// Authenticated routes: /api/auth
////////////////////////////////////////////////////////////////////////////////

// User login.
authRoutes.post('/login', rfr('/server/routes/api/auth/login'));

// Middleware to verify JSON Web Tokens.
authRoutes.use(verifyJwt);

// Base endpoint for the /auth router.
authRoutes.get('/', rfr('/server/routes/api/auth/index'));

// Create new poll.
authRoutes.post('/create_poll', rfr('/server/routes/api/auth/create_poll'));

// Endpoint to cast a vote.
authRoutes.post('/cast_vote', rfr('/server/routes/api/auth/cast_vote'));

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
