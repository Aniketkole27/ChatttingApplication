const express = require('express'); 
const app = express();   
const PORT  = 9000;      
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const { sharedFunction } = require('./public/shared');
// const name = require('./public/main');

// connect to the database
io.on('connection', (socket) => {
    console.log('a user connected');
    // console.log(sharedFunction());
    socket.broadcast.emit('newPerson', "new Person is added !");

    socket.on('join-room',(room)=>{
        socket.join(room);
        socket.broadcast.emit('joined',({message: "new user is add",room}));
    })


  // Handle chat messages from clients 
    socket.on('chat-message', (msg)=>{
        // Emit the message to all clients
        io.emit('message', sharedFunction('Aniket',msg));
    })

    function getData(name, room) {
        console.log(`Emitting User Data: Name = ${name}, Room = ${room}`);
                
            io.emit('userData', { name, room });
        
    }

})


// Serve the login page on the root route
app.get('/', (req, res) => {
    const { name, room } = req.query; // Capture query parameters

    if(name=== undefined || room === undefined){
        
    }
    else{
        console.log(`Name: ${name}, Room: ${room}`);
        getData(name, room);
    }
   
    res.sendFile(path.join(__dirname, 'public', 'loginPage.html'));
    // res.sendFile(path.resolve('./public/loginPage.html'));

});

// app.use(express.static(path.resolve('./public')));  
app.use(express.static(path.join(__dirname, 'public')));


// Start the server on port 9000
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


