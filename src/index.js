const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../src/public');

app.use(express.static(publicDirectoryPath));

let welcomeMessage = "Welcome!";
const googleMapsURL = "https://google.com/maps?q=";
const filter = new Filter();

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('join', ({ username, room }) => {
        socket.join(room);

        socket.emit('message', generateMessage(welcomeMessage));
        socket.broadcast.to(room).emit('message', generateMessage(`${ username } has joined!`));
    })

    socket.on('sendMessage', (message, callback) => {
        
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed');
        }
        
        io.to('Berlin').emit('message', generateMessage(message));
        callback();
    })

    socket.on('sendLocation', (coords, callback) => {
        if (filter.isProfane(coords)) {
            return callback('Profanity is not allowed');
        }
        
        io.emit('locationMessage', generateLocationMessage(`${ googleMapsURL }${ coords.latitude },${ coords.longitude }`)); 
        callback();       
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left!'));
    })
})

server.listen(port, () => {
    console.log(`App is listen on ${ port }!`);
})