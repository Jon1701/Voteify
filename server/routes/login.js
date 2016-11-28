// Mongoose.
const mongoose = require('mongoose');

// Json web token library.
const jwt = require('jsonwebtoken');

// Access application environment variables.
const appConfig = require('../config/appConfig');

// Connect to the database.
const dbConfig = require('../config/dbConfig');
mongoose.createConnection(dbConfig['connString']);

// Database model.
const User = require('../models/User');

// Module for generating hashed passwords.
const hashedAuthentication = require('../authentication/userLogin');

// Route definition.
const login = (req, res, next) => {

  // Get username and password.
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided.
  if (!username || !password) {
    return next('Both a username and password are required.');
  }

  // Access the database.
  User.findOne({username: username}, (error, result) => {

    // Error check.
    if (error) { return next('Login failed. Unable to access database.'); }

    // Check if a matching user was found.
    if (result) {

      // Get the user's salt from the database.
      const userSalt = result.password.salt;

      // Get the user's hashed password from the database.
      const userHashedPassword = result.password.hash;

      // Generate a hashed password using given plaintext password
      // and salt.
      const generatedHashedPassword = hashedAuthentication.generateHashedPassword(password, userSalt).hash;

      // Compare the stored hashed password with the generated one.
      if (userHashedPassword == generatedHashedPassword) {

        // Create a JSON web token using the username, and secret signing key, which
        // expires in 24 hours.
        const token = jwt.sign(
          {username: username},
          appConfig.JWT_SIGNING_KEY,
          {expiresIn: appConfig.JWT_TOKEN_EXPIRATION_MINUTES}
        );

        // Send jsonwebtoken as response.
        return res.json({
          success: true,
          message: 'Token generated',
          token: token
        });

      } else {

        // Passwords do not match, return an error.
        return next('Invalid username or password.');
      }

    } else {

      // No user found, just return an error stating invalid username or password.
      return next('Invalid username or password');
    }

  });

}

// Export route definition.
module.exports = login;
