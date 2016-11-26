// Express.
var express = require('express');
var app = express();

// Create, sign, verify JSON web tokens.
const jwt = require('jsonwebtoken');

// Gets parameters from requests.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Mongoose.
const mongoose = require('mongoose');

////////////////////////////////////////////////////////////////////////////////
// Routes.
////////////////////////////////////////////////////////////////////////////////
app.get('/test', (req, res) => {
  return res.send("hello world");
});

////////////////////////////////////////////////////////////////////////////////
// Serve files from the ./dist folder.
////////////////////////////////////////////////////////////////////////////////
app.use(express.static('dist'));

////////////////////////////////////////////////////////////////////////////////
// Route to handle errors.
////////////////////////////////////////////////////////////////////////////////
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

////////////////////////////////////////////////////////////////////////////////
// Server.
////////////////////////////////////////////////////////////////////////////////
var port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Listening for connections on PORT ' + port);
});
