
const express = require('express'); 
const app = express();   
const PORT  = 9000;      
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);


io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.broadcast.emit('newPerson', "new Person is added !");

    socket.on('join-room',(room)=>{
        socket.join(room);
        socket.broadcast.emit('joined',({message: "new user is add",room}));
    })


    // 2nd same massage with it's name "chat-message"
    socket.on('chat-message', (msg)=>{
        // emit that message to all , using io.emit();
        io.emit('message', msg);
    })

})

// app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, 'public', 'loginPage.html'));
    res.sendFile(path.resolve('./public/loginPage.html'));

    // return res.sendFile('/public/index.html');   
});
app.use(express.static(path.resolve('./public')));  



server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
