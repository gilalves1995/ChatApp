const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

// Public directory setup
app.use(express.static(publicDirectoryPath));


// let count = 0;
io.on('connection', (socket) => {
    console.log('New WebSocket connection.');

    // Emits the message only to this particular socket
    socket.emit('message', 'Welcome!');

    // Emits the message to every connection except this particular socket
    socket.broadcast.emit('message', 'A new user has joined.');

    socket.on('sendMessage', (message) => {
        // Emits the message to every connection including this socket
        io.emit('message', message);
    });

    // Disconnection handler
    socket.on('disconnect', () => {
       io.emit('message', 'A user has left.');
    });
});




server.listen(port, () => {
   console.log(`Server is up and running on port ${port}.`);
});


/* The WebSocket Protocol */