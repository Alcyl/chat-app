const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users');

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

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        
        if (error) {
            return callback(error);
        }
        
        socket.join(user.room);

        socket.emit('message', generateMessage("Admin", welcomeMessage));
        socket.broadcast.to(user.room).emit('message', generateMessage("Admin", `${ user.username } has joined!`));
        io.to(user.room).emit('room-data', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);    

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed');
        }
        
        io.to(user.room).emit('message', generateMessage(user.username, message));
        callback();
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id);
        if (filter.isProfane(coords)) {
            return callback('Profanity is not allowed');
        }
        
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `${ googleMapsURL }${ coords.latitude },${ coords.longitude }`)); 
        callback();       
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage("Admin", `${ user.username } has left!`));
            io.to(user.room).emit('room-data', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })    
        }
        
    })
})

server.listen(port, () => {
    console.log(`App is listen on ${ port }!`);
})