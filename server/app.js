const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8080;

app.use('/', express.static(path.join(__dirname, '../client')));

server.listen(port);
console.log(`Server listening on port: ${port}`);

io.sockets.on('connection', socket =>{
	init(socket);
});

function init(socket){
	const msg = `Welcome to Robs Brawlhalla Page`;
	socket.emit('helloworld', msg);
}