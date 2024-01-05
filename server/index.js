const express = require('express');
const app = express();

const bodyParser = require('body-parser')

app.use(bodyParser.json())

// socket
const {Server} = require('socket.io');

const io = new Server({
    cors:true
})

const socketToRoom = new Map();

io.on('connection', (socket) => {
    console.log(`User Connected ${socket.id}`);

    socket.on('join-room', (data) => {
        const { name, room} = data;
        console.log(`${name} User Join ${room}`);
        socket.emit('joined-room',{room});
        socket.join(room);
        socketToRoom.set(socket.id,room);

        // when new user join then show
        socket.broadcast.to(room).emit('user-joined',{name});
    })

    
    socket.on('send-file', (data) => {
        // console.log(file);
        const {file, socketId} = data;
        // console.log(socketId);
        // console.log(file);
        const base64Data = file.replace(/^data:image\/png;base64,/, '');
        require('fs').writeFileSync('image.png', base64Data, 'base64');

        const room = socketToRoom.get(socketId)
        socket.broadcast.to(room).emit('receive-file',base64Data);
   
    })

    socket.on('disconnect', () => {
        console.log(`User Disconnect ${socket.id}`);
        socket.disconnect()
    })
})

app.listen(9000,() => {
    console.log("Server Started at ", 9000);
})
io.listen(9001);