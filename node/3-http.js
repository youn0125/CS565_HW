'use strict';

var http = require('http'); // do not change this line

// http://localhost:8080/missing should return a status code 404 with 'your princess is in another castle' in plain text

// http://localhost:8080/redirect should redirect the request to '/redirected' by using 302 as the status code

// http://localhost:8080/cache should return 'cache this resource' in plain text and set the cache max age to a day

// http://localhost:8080/cookie should return 'i gave you a cookie' in plain text and set 'hello=world' as a cookie

// http://localhost:8080/check should return 'yes' / 'no' in plain text depending on whether the browser has the 'hello' cookie

//

//Parsing cookies function.
function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}
		
var server = http.createServer(function( req, res) {  
    if (req.url === '/missing') {
		//Set a status code 404.
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.write("your princess is in another castle");
        res.end();
    }
    else if (req.url === '/redirect') {
		//Redirect the request.
        res.writeHead(302, { 'Location': '/redirected'
            //add other headers here...
        });
        res.end();
    }
    else if (req.url === '/cache') {
        var d = new Date();
        var dDate = d.getDay() * 60 * 12 * 24;
        console.log(dDate);
		//Set the cache max age to a day.
        res.writeHead(200, { "Content-Type": "text/plain",
        'Cache-Control': `max-age=${dDate}`
            //add other headers here...
        });
        res.write("cache this resource");
        res.end();
    }
    else if (req.url === '/cookie') {
		//Set 'hello=world' as a cookie.
        res.writeHead(200, {'Content-Type': 'text/plain',
                            'Set-cookie': ['hello=world']});   
        res.write("i gave you a cookie"); 
        res.end();
    }
    else if (req.url === '/check') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
		//Parse cookies and return value whether the browser has the 'hello'(key) cookie.
        var mycookie = parseCookies(req).hello;
        console.log(mycookie);
		//  Return 'yes' / 'no' depending on whether the browser has the 'hello' cookie
        if(mycookie != null)
            res.write("yes");
        else
            res.write("no"); 
        res.end();
    }
    else
        res.end();
});
server.listen(process.env.PORT || 8080);
