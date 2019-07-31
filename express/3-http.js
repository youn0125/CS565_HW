'use strict';

var express = require('express'); // do not change this line
const cookieParser = require('cookie-parser'); //add middleware.

// http://localhost:8080/missing should return a status code 404 with 'your princess is in another castle' in plain text

// http://localhost:8080/redirect should redirect the request to '/redirected' by using 302 as the status code

// http://localhost:8080/cache should return 'cache this resource' in plain text and set the cache max age to a day

// http://localhost:8080/cookie should return 'i gave you a cookie' in plain text and set 'hello=world' as a cookie

// http://localhost:8080/check should return 'yes' / 'no' in plain text depending on whether the browser has the 'hello' cookie

const server = express();
server.use(cookieParser());

server.get('/missing', function(req,res) {
    res.status(404);
    res.set({'Content-type': 'text/plain'});
    res.send('your princess is in another castle');
});

server.get('/redirect', function(req,res) {
    res.status(302);
	//redirect the request
    res.redirect('/redirected')
});

server.get('/cache', function(req,res) {
    var dDate = 24*60*60;
    res.status(200);
    res.set({'Content-type': 'text/plain'});
	//set the cache max age to a day
    res.set('Cache-Control', `max-age=${dDate}`);
    res.send('cache this resource');
});

server.get('/cookie', function(req,res) {
    res.status(200);
    res.set({'Content-type': 'text/plain'});
	//set 'hello=world' as a cookie
    res.set('Set-cookie', `${['hello']}=world`);
    res.send('i gave you a cookie');
});

server.get('/check', function(req,res) {
    res.status(200);
    res.set({'Content-type': 'text/plain'});
	//check the browser has the 'hello' cookie
    var mycookie = req.cookies.hello;
    if(mycookie != null)
        res.send("yes");
    else
       res.send("no"); 
});

server.listen(process.env.PORT || 8080);
