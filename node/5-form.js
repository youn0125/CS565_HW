'use strict';

var http = require('http'); // do not change this line
var querystring = require('querystring'); // do not change this line

// http://localhost:8080/form should return the form as shown below
//   res.writeHead(200, {
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

// http://localhost:8080/new should retrieve the post data, save the name / message (in a global variable) and return 'thank you for your message' in plain text

// http://localhost:8080/list should return the stored messages (from the global variable) 'name: message\nanother name: another message' in plain text

// [the server restarts and looses all messages]

// http://localhost:8080/list should return '' in plain text

var g_myObj = {};	//set global variable.

var server = http.createServer(function( req, res) {  
    if (req.url === '/form') {
        res.writeHead(200, {'Content-Type': 'text/html'});  
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
    }
	else if (req.url === '/new') {
		//request post method from /form.
        if (req.method == 'POST') {
			var body = '';

			req.on('data', function (data) {
				body += data;

				// Too much POST data, kill the connection!
				// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
				if (body.length > 1e6)
					req.connection.destroy();
			});
			
			//parse body with querystring and set to g_myObj(global variable).
			req.on('end', function () {
                var post = querystring.parse(body);
                g_myObj[post.name] = post.message;
			});
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.write('thank you for your message');
            res.end();
		}
    }
	else if (req.url === '/list') {
		//list values of name and message from g_myObj
        res.writeHead(200, {'Content-Type': 'text/plain'});  
		var size = Object.keys(g_myObj).length;
		if (size == 0)
			res.write('');
		else if (size == 1){
			for (var key in g_myObj){
                res.write(`${key}: ${g_myObj[key]}`);
			}
		}
        else {
            console.log(g_myObj);
			var i= 0;
			for (var key in g_myObj){
                res.write(`${key}: ${g_myObj[key]}`);
				if (i != Object.keys(g_myObj).length-1)
					res.write('\n');
				i++;   
			}
        }
        res.end();
    }
	
    else
        res.end();
});
server.listen(process.env.PORT || 8080);
