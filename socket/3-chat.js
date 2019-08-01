'use strict';

var express = require('express'); // do not change this line
var socket = require('socket.io'); // do not change this line
var assert = require('assert'); // do not change this line

var server = express();

server.use('/', express.static(__dirname + '/'));

var io = socket(server.listen(process.env.PORT || 8080)); // do not change this line

var clients = [];
io.on('connection', function(objectSocket) {
	// send everyone the 'clients' event, containing an array with the ids of the connected clients - example: { 'strClients':['GxwYr9Uz...','9T1P4pUQ...'] }
	// send everyone the 'message' event, containing a message that a new client connected - example: { 'strFrom':'server', 'strTo':'everyone', 'strMessage':'9T1P4pUQ... connected' }
	console.log('client connected');

	//push client id to client array.
	clients.push(objectSocket.id); 
	//client event to every clients.
	io.emit('clients', {
		'strClients':clients
	});
	//message event to every clients.
	io.emit('message', {
		'strFrom':'server', 
		'strTo':'everyone', 
		'strMessage': objectSocket.id + ' connected'
	});

	//message event received.
	objectSocket.on('message', function(objectData) {
		// if the message should be received by everyone, broadcast it accordingly
		// if the message has a single target, send it to this target as well as to the origin
		console.log(objectData);

		assert(objectData.strTo !== undefined);
		assert(objectData.strMessage !== undefined);

		//add strFrom to client id.
		objectData.strFrom = objectSocket.id;

		//if the message to everyone, brooadcast it.
		if ( objectData.strTo === 'everyone'){
			io.emit('message', objectData);	
		}
		else{	//If the message to single target.
			io.to(objectData.strTo).emit('message', objectData);
			io.to(objectData.strFrom).emit('message', objectData);
		}

	});

	objectSocket.on('disconnect', function() {
		// send everyone the 'clients' event, containing an array of the connected clients - example: { 'strClients':['GxwYr9Uz...'] }
		// send everyone the 'message' event, containing a message that an existing client disconnected - example: { 'strFrom':'server', 'strTo':'everyone', 'strMessage':'9T1P4pUQ... disconnected' }

		//remove the client from clients array.
		for( var i = 0; i < clients.length; i++){ 
			if ( clients[i] === objectSocket.id) {
				clients.splice(i, 1); 
			}
		 }
		io.emit('clients', {
			'strClients':clients
		});

		io.emit('message', {
			'strFrom':'server', 
			'strTo':'everyone', 
			'strMessage': objectSocket.id + ' disconnected'
		});
	});
});

console.log('go ahead and open "http://localhost:8080/3-chat.html" in your browser');