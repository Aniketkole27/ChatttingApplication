
const socket = io();

const ul = document.querySelector("#messages");
const input = document.getElementById('input');
const btn = document.getElementById('btn');


socket.emit('join-room', 'room1');

// 3rd check for the name 'message' and append it 
socket.on("message", (message) => {
    // let li = document.createElement('li');
    // li.textContent = message;
    // ul.appendChild(li);
    addMessage(message, getCurrentDateTime());
});

// start exicuting 
btn.addEventListener('click', (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (message) {
        // 1st emit the message  
        socket.emit("chat-message", message);
        // console.log(message);
        input.value = "";
    }
})


socket.on('newPerson', (message) => {
    console.log(message);
})
// socket.on('broadcast_message', (data) => {
//     console.log('Broadcasted Message:', data.message);
// });

socket.on('joined', (data) => {
    console.log(`${data.message} in this room ${data.room}`)
})

function addMessage(message, time) {
    if (message) {

        // let li = document.createElement('li');
        // let span = document.createElement('span');
        // span.textContent = time;
        // li.textContent = message;
        // li.appendChild(span);
        // ul.appendChild(li);

        const p = document.createElement("p");

        p.innerHTML = `
             <p class='user'>john <span style="font-size: 0.8rem; color: black;">(${time})</span> <br>
            <strong style='color:black;'>${message}</strong> </p> `;
        ul.appendChild(p);

        // Scroll to bottom
        ul.scrollTop = ul.scrollHeight;


    }
    // console.log(getCurrentDateTime());
}


function getCurrentDateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Adjust for 12:00 AM/PM case

    return `${hours.toString().padStart(2, '0')}:${minutes} ${period}`;
}


