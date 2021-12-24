let peers = {};
const socket = io('https://guarded-plateau-04700.herokuapp.com/');
// const socket = io('http://localhost:3000');
let roombox = document.getElementsByClassName("room")[0];
let roomidtext = document.getElementsByClassName("roomid")[0];
var peer = new Peer();
var id="";
var usernames = {};
const call = (username) => {
    // content.style.display = "none";
    roombox.style.display = "flex";
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        const div = document.createElement("div");
        let video = document.createElement("video");
        video.muted=true;
        addvideostream(div,video, stream, "You");
        
        socket.on("user-connected", (userid, username) => {
            
            let call = peer.call(userid, stream);
            console.log(call);
            let bool = true;
            call.on("stream", stream => {
                const div = document.createElement("div");
                let video = document.createElement("video");
                console.log(stream);
                if(bool){
                    addvideostream(div, video, stream, username);
                    appendmessage(username + " : Joined ");
                }
                bool = false;
                call.on("close", () => {
                    video.remove();
                    div.remove();
                })
            })
            usernames[userid] = username;
            peers[userid] = call;
        })
        peer.on("call", call => {
            console.log("hello", call);
            answercall(call, stream);
        })

    })
}

const answercall = (Call, stream) => {
    console.log(Call);
    Call.answer(stream);
    let bool = true;
    Call.on("stream", stream => {
        console.log(usernames[Call.peer]);
        const div = document.createElement("div");
        let video = document.createElement("video");
        if(bool)
        addvideostream(div,video, stream,usernames[Call.peer])
        bool = false;
        Call.on("close", () => {
            video.remove();
            div.remove();
        })
    })
    peers[Call.peer] = Call;
    
}
socket.on("user-disconnected", (userid) => {
    console.log(peers[userid], userid);
    appendmessage(usernames[userid] + " : left");
    let target = peers[userid];
    target.close();
})
socket.on("usersdata", usernamedata => {
    console.log(usernamedata);
    usernames = {...usernamedata};
})
const addvideostream = (div,video, stream,username) => {
    let body=document.getElementsByClassName("videogrid")[0];
    video.srcObject = stream;
   
    const textnode = document.createElement("h2");
    textnode.innerText = username;
    div.append(video);
    div.append(textnode);
    body.append(div);
    video.play();
}

const Join = () => {
    let roomid = ROOM_ID;
    let username = prompt("username: ");
    socket.emit("join-room",id,roomid,username);
    call(username);
    roomidtext.innerText += roomid;
}
peer.on('open', function (i) {
    id = i;
    console.log("ID", id);
    Join();
});



//Messaging part

let sendbtn = document.getElementById("send");
let Message = document.getElementById("message");
let chats = document.getElementById("chats");

const appendmessage = (message) => {
    const textnode = document.createElement("h3");
    textnode.innerText = message;
    chats.append(textnode);
}
sendbtn.onclick = () => {
    socket.emit("message-send", Message.value);
    appendmessage("You :"+Message.value);
    Message.value = "";
}
socket.on("message-recieved",(username, message) => {
    appendmessage(username+" : "+message);
})