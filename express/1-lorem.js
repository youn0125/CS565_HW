'use strict';

var express = require('express'); // do not change this line

// http://localhost:8080/lorem should return '<!DOCTYPE html><html><body>lorem ipsum</body></html>' as html
const server = express();

//GET method route.
server.get('/lorem', function(req,res) {
    res.status(200);
    res.set({'Content-type': 'text/html'});
    res.send('<!DOCTYPE html><html><body>lorem ipsum</body></thml>');
});

server.listen(process.env.PORT || 8080);
