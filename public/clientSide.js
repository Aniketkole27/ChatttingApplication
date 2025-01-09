
const socket = io();

const ul = document.querySelector("#messages");
const input = document.getElementById('input');
const btn = document.getElementById('btn');

 // Emit an event to join a specific room
socket.emit('join-room', 'room1');

// Listen for incoming messages from the server
socket.on("message", (message) => {
    console.log(message);
    addMessage(message.user, message.text, getCurrentDateTime());
});

socket.on('userData', (data) => {
    let p = document.createElement('p');
    p.innerHTML = `User: ${data.name} has joined the room ${data.room}`;
    ul.appendChild(p);
})



// start exicuting when the button is clicked
btn.addEventListener('click', (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (message) {
        // Emit message to server
        socket.emit("chat-message", message);
        input.value = "";
    }
})

// Listen for notification of a new person joining
socket.on('newPerson', (message) => {
    console.log(message);
})

// Listen for confirmation of joining a room
socket.on('joined', (data) => {
    console.log(`${data.message} in this room ${data.room}`)
})

  
function addMessage(name, message, time) {
    // Append message to the chat
    if (message) {
        const p = document.createElement("p");
        p.innerHTML = `
        <p class='user'>${name} <span style="font-size: 0.8rem; color: black; margin-left:7px;">${time}</span> <br>
        <strong style='color:black;'>${message}</strong> </p> `;
        ul.appendChild(p);
        
        // Scroll to bottom
        ul.scrollTop = ul.scrollHeight;
    }
    // console.log(getCurrentDateTime());
}

// Get current time in HH:MM AM/PM format
function getCurrentDateTime() {
   
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Adjust for 12:00 AM/PM case

    return `${hours.toString()}:${minutes} ${period}`;
}


