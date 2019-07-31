'use strict';

var express = require('express'); // do not change this line
var parser = require('body-parser'); // do not change this line

// preface: use the body-parser middleware that helps you retrieve and parse the post data from the form

// http://localhost:8080/form should return the form as shown below
//   res.status(200);
//   
//   res.set({
//   	'Content-Type': 'text/html'
//   });
//   
//   res.write('<!DOCTYPE html>');
//   res.write('<html>');
//   	res.write('<body>');
//   		res.write('<form action="/new" method="post">');
//   			res.write('<input type="text" name="name">');
//   			res.write('<input type="text" name="message">');
//   			res.write('<input type="submit" value="submit">');
//   		res.write('</form>');
//   	res.write('</body>');
//   res.write('</html>');
//   
//   res.end();

// http://localhost:8080/new should retrieve the post data, save the name / message (in a global variable) and return 'thank you for your message' in plain text

// http://localhost:8080/list should return the stored messages (from the global variable) 'name: message' in plain text

// http://localhost:8080/form should return the form as shown above

// http://localhost:8080/new should retrieve the post data using the body parser, save the name / message (in a global variable) and return 'thank you for your message' in plain text

// http://localhost:8080/list should return the stored messages (from the global variable) 'name: message\nanother name: another message' in plain text

// [the server restarts and looses all messages]

// http://localhost:8080/list should return '' in plain text

const server = express();
var g_myObj = {};	//set global variable.
// create application/x-www-form-urlencoded parser
var urlencodedParser = parser.urlencoded({ extended: false })

server.get('/form', function(req,res) {
    res.status(200);
    res.set({'Content-type': 'text/html'});
    res.write('<!DOCTYPE html>');
    res.write('<html>');
    res.write('<body>');
    res.write('<form action="/new" method="post">');
    res.write('<input type="text" name="name">');
    res.write('<input type="text" name="message">');
    res.write('<input type="submit" value="submit">');
    res.write('</form>');
    res.write('</body>');
    res.write('</html>');
    res.end();
});
server.post('/new', urlencodedParser, function(req,res) {
    g_myObj[req.body.name] = req.body.message;
    res.set({'Content-type': 'text/plain'});
	res.send('thank you for your message');
});
server.get('/list', function(req,res) {
    res.status(200);
    res.set({'Content-type': 'text/plain'});
	var size = Object.keys(g_myObj).length;
	if (size == 0)
		res.write('');
	else if (size == 1){
		for (var key in g_myObj){
            res.write(`${key}: ${g_myObj[key]}`);
		}
	}
    else {
		var i= 0;
		for (var key in g_myObj){
            res.write(`${key}: ${g_myObj[key]}`);
			if (i != Object.keys(g_myObj).length-1)
				res.write('\n');
			i++;   
		}
    }
    res.end();
});

server.listen(process.env.PORT || 8080);