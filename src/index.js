const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

// Public directory setup
app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('New WebSocket connection.');

    socket.on('join', ({ username, room }) => {
        socket.join(room);

        // Emits the message only to this particular socket
        socket.emit('message', generateMessage('Welcome!'));

        // Emits the message to every connection except this particular socket
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined.`));
    });

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed.');
        }

        // Emits the message to every connection including this socket
        io.to('Center City').emit('message', generateMessage(message));
        callback();
    });


    socket.on('sendLocation', ({ latitude, longitude }, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${longitude},${latitude}`));
        callback();
    });

    // Disconnection handler
    socket.on('disconnect', () => {
       io.emit('message', generateMessage('A user has left.'));
    });
});




server.listen(port, () => {
   console.log(`Server is up and running on port ${port}.`);
});


/* The WebSocket Protocol */

