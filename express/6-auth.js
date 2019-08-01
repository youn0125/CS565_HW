'use strict';

var express = require('express'); // do not change this line
var passport = require('passport'); // do not change this line
var strategy = require('passport-http'); // do not change this line

// preface: use the passport middleware and only grant the user "test" with the password "logmein" access

// note: should the server restart, the browser will still technically be logged in since we are using the http basic access authentication which lets the browser store and submit the username and the password at each request

// http://localhost:8080/hello should return 'accessible to everyone' in plain text

// http://localhost:8080/world should return 'only accessible when logged in' in plain text if the user is authenticated, otherwise it should prompt for the username and password

// http://localhost:8080/test should return 'only accessible when logged in' in plain text if the user is authenticated, otherwise it should prompt for the username and password
const server = express();
var authData = {
  userid: 'test',
  password: 'logmein',
};
passport.use(new strategy.BasicStrategy(
  function(userid, password, done) {
    if (userid === authData.userid) {
      if (password === authData.password) {
          return done(null, authData, {
              message: 'only accessible when logged in'
          });
      } else {
          return done(null, false, {
              message: 'Incorrect password.'
          });
      }
  } else {
      return done(null, false, {
          message: 'Incorrect username.'
      });
  }
  }
));

server.get('/hello', function(req,res) {
  res.status(200);
  res.set({'Content-type': 'text/plain'});
  res.send('accessible to everyone');
});

server.get('/world', 
  passport.authenticate('basic', { session: false }),
  function(req, res) {
    res.json(req.user);
  }
);

server.get('/test', 
  passport.authenticate('basic', { session: false }),
  function(req, res) {
    res.status(200);
    res.set({'Content-type': 'text/plain'});
    res.send('only accessible when logged in');
  }
);

server.listen(process.env.PORT || 8080);