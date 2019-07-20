'use strict';

var http = require('http'); // do not change this line

// note: handling for the requests should be generic and your server should appropriately respond to any path, including ones not listed below

// http://localhost:8080/hello should return 'you must be new' in plain text and set an ident cookie
// http://localhost:8080/test should return 'last time you visited "/hello"' in plain text
// http://localhost:8080/world should return 'last time you visited "/test"' in plain text

// [now sending requests from a different browser]

// http://localhost:8080/lorem should return 'you must be new' in plain text and set an ident cookie
// http://localhost:8080/moshimoshi should return 'last time you visited "/lorem"' in plain text
// http://localhost:8080/ipsum should return 'last time you visited "/moshimoshi"' in plain text

// [sending requests from the original browser again]

// http://localhost:8080/again should return 'last time you visited "/world"' in plain text

// [the server restarts and looses all cookies]

// http://localhost:8080/servus should return 'you must be new' in plain text and set an ident cookie

//Parsing cookies function.
function parseCookies (req) {
    var list = {},
        rc = req.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

var server = http.createServer(function( req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	
    var rc = req.headers.cookie;
    if (rc == null){
		//When the cookie is empty.
		//Set cookie with substring of url.
        res.writeHead(200, {'Content-Type': 'text/plain',
        'Set-cookie': `${[req.url.substr(1)]} = 1` });
        console.log(req.headers.cookie);
        res.write('you must be new');
        res.end();
    }
    else {
		//When the cookie is not empty, parse cookies.
        var mycookie = parseCookies(req);
        console.log(mycookie);
		//Get the last element of cookies.
        var last_element = Object.keys(mycookie)[Object.keys(mycookie).length-1];
		//Set cookie with substring of url.
        res.writeHead(200, {'Content-Type': 'text/plain',
        'Set-cookie': `${[req.url.substr(1)]} = 1` });
        res.write(`last time you visited \"/${last_element}\"`);
        res.end();
    }

});
server.listen(process.env.PORT || 8080);
