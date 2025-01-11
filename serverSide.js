const express = require('express');
const app = express();
const PORT = 9000;
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const { sharedFunction } = require('./public/shared');
// const name = require('./public/main');

// connect to the database
const member = {};

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('newPerson', "new Person is added !");

    socket.on('java-room', (room) => {
        member[socket.id] = {userName : room.userName, room : room.room};
        socket.join(room.room);
        io.emit('updata-Member', room.userName);
        
        socket.emit('private-chat',member[socket.id]);
        socket.broadcast.emit('joined', member[socket.id]);
    })


    // Handle chat messages from clients 
    // let text = '';
    socket.on('chat-message', (msg) => {
        // Emit the message to all clients 
        io.emit('message', sharedFunction(msg.userName,msg.message));

    })
})


// Serve the login page on the root route
app.get('/', (req, res) => {
    const { name, room } = req.query;
    // getData()
    res.sendFile(path.join(__dirname, 'public', 'loginPage.html'));

    // res.sendFile(path.resolve('./public/loginPage.html'));
}); 

// app.use(express.static(path.resolve('./public')));  
app.use(express.static(path.join(__dirname, 'public')));


const getData = () =>{
    console.log(`Emitting User Data: Name = ${name}, Room = ${room}`);
    io.emit('userData', { name, room });
}




// Start the server on port 9000
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


