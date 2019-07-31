'use strict';

var express = require('express'); // do not change this line
var session = require('express-session'); // do not change this line
const cookieParser = require('cookie-parser');

// preface: use the express-session middleware with the memorystore session storage which should make this task rather easy

// http://localhost:8080/hello should return 'you must be new' in plain text and implicitly set an ident cookie by using the session middleware

// http://localhost:8080/test should return 'your history:\n  /hello' in plain text

// http://localhost:8080/world should return 'your history:\n  /hello\n  /test' in plain text

// [now sending requests from a different browser]

// http://localhost:8080/lorem should return 'you must be new' in plain text and implicitly set an ident cookie by using the session middleware

// http://localhost:8080/moshimoshi should return 'your history:\n  /lorem' in plain text

// http://localhost:8080/ipsum should return 'your history:\n  /lorem\n  /moshimoshi' in plain text

// [sending requests from the original browser again]

// http://localhost:8080/again should return 'your history:\n  /hello\n  /test\n /world' in plain text

// [the server restarts and looses all cookies]

// http://localhost:8080/servus should return 'you must be new' in plain text and implicitly set an ident cookie by using the session middleware

const server = express();
server.use(cookieParser());
server.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }));

server.get('/:parameter', function(req,res,next) {
	//set page_views property to session object.
    if(req.session.page_views){
        req.session.page_views++;
        res.status(200);
        res.set({'Content-type': 'text/plain'});
        var history = '';
        for (var key in req.cookies) {
			//exclude the connect.sid cookie.
            if(key !== 'connect.sid')
                history += '\n  /' + key;
          }
        res.set('Set-cookie', `${[req.params.parameter]} = 1`);
        res.send('your history:' + history);
     } else {
        req.session.page_views = 1;
        res.status(200);
        res.set({'Content-type': 'text/plain'});
		//set cookie with parameter.
        res.set('Set-cookie', `${[req.params.parameter]} = 1`);
        res.send("you must be new");
     }

});

server.listen(process.env.PORT || 8080);