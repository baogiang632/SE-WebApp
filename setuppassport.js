// file:app/authenticate/init.js
const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const findOne = require('./dbfunction/authen').findOne;

module.exports = function () {
  //turns a user object into an id
  passport.serializeUser(function (user, done) {
      //serializing the user
      done(null, user.id);
  });
  //turns the id into a user object
  passport.deserializeUser(function (username, done) {
      done(err, username);
  });

  passport.use(new LocalStrategy(
  (username, password, done) => {
      findOne(username, (err, user) => {
        if (err) {
          return done(err)
        }

        // User not found
        if (!user) {
          return done(null, false)
        }

        // Always use hashed passwords and fixed time comparison
        bcrypt.compare(password, user.PASS, (err, isValid) => {
          if (err) {
            return done(err)
          }
          if (!isValid) {
            return done(null, false)
          }
          return done(null, user)
        })
      })
    }
  ))
}