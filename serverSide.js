
const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// make socket.io connection
io.on('connection', (socket) => {
    console.log('a user connected');
    
    // 2nd same massage with it's name "chat-message"
    socket.on('chat-message', (msg)=>{
        // emit that message to all using io.emit();
        io.emit('message', msg);
    })
})

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve('./public')));

app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, 'public', 'index.html'));
    return res.sendFile('/public/index.html');
});



server.listen(9000, () => {
    console.log('Server is running on port 9000');
})
