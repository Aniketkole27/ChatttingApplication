
const socket = io();

const ul = document.querySelector("#messages");
const input = document.getElementById('input');
const btn = document.getElementById('btn');
const welcomeText = document.querySelector('.userwelcome');


// Listen for incoming messages from the server
socket.on("message", (message) => {
    console.log(message);
    addMessage(message.user, message.text, getCurrentDateTime());
});

const queryPara = new URLSearchParams(window.location.search);
const userName = queryPara.get("name");
const room = queryPara.get("room");

switch(room.toLowerCase()){
    case 'java': socket.emit('java-room',{userName,room});
    break;

    case 'c++': socket.emit('c++-room',{userName,room});
    break;

    case 'javascript' : socket.emit('javascript-room',{userName,room});
    break;
    
    case 'python' : socket.emit('python-room',{userName,room});
    break;
}


// start exicuting when the button is clicked
btn.addEventListener('click', (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (message) {
        // Emit message to server
        socket.emit("chat-message",{userName,message});
        input.value = "";
    }
})

socket.on('updata-Member', (data) => {
    // data.preventDefault();
    updataFunction(data);
})

const updataFunction = (data) => {
    const newUser = document.querySelector('.members');
    let li = document.createElement('li');
    // console.log("i am in updata function")
    li.innerText = data;
    newUser.append(li);  
}

const notifyUsers = (data)=>{
    let p = document.createElement('p');
    p.innerHTML = `<p>New user <strong> ${data.userName} </strong> joined the <strong> ${data.room} </strong> room.</p>`;
    p.style.marginBottom = '10px';
    p.style.backgroundColor = 'lightgray';
    p.classList.add('user');
    // p.style.margin = '0px';
    // p.style.outline = 'none';
    ul.append(p);
}

// Listen for notification of a new person joining
// socket.on('newPerson', (message) => {
//     console.log(message);
// })

// Listen for confirmation of joining a room
socket.on('joined', (data) => {
    notifyUsers(data);
})


socket.on('private-chat', (data)=>{
    let p = document.createElement('p');
    p.innerHTML =  `<p style='color:black;'> Hi <strong> ${data.userName} </strong> Welcome to the <strong> ${data.room} </strong> room.</p>`;
    p.classList.add('user');
    welcomeText.append(p);
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


