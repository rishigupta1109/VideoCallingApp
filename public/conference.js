
let peers = {};
let videos = {};
const socket = io('https://guarded-plateau-04700.herokuapp.com/');
// const socket = io('http://localhost:3000');
let roombox = document.getElementsByClassName("room")[0];
let roomidtext = document.getElementsByClassName("roomid")[0];
var peer = new Peer();
var id="";
var usernames = {};
// const createimgs = () => {
//     let img1 = document.createElement("image");
//     img1.setAttribute("src","microphone.png")
//     let img1i = document.createElement("image");
//     img1i.setAttribute("src","microphonemute.png")
//     let img2 = document.createElement("image");
//     img2.setAttribute("src","video.png")
//     let img2i = document.createElement("image");
//     img2i.setAttribute("src", "videomute.png")
//     return [img1, img1i, img2, img2i];
// }

const muteHandler = (e) => {
    let btn = e.target;
    if (btn.getAttribute("data-key") == id) {
        if (btn.getAttribute("data-type") == "audio") {
            if (btn.getAttribute("data-mute") == "true") {
                videos[id].getTracks()[0].stop();
                btn.setAttribute("data-mute", "false");
                btn.style.backgroundImage = `url(microphone.png)`;
            }
            else {
                btn.setAttribute("data-mute", "true");
                videos[id].getTracks()[0].stop();
                btn.style.backgroundImage = `url(microphonemute.png)`;
                
            }
        }
        
    }
    
}
// socket.on("mute-his-audio", id => {
//     peers[id].mute(); 
// })
// socket.on("unmute-his-audio", id => {
//     peers[id].unmute(); 
// })
const buttonsmaker = () => {
    // let btn1 = document.createElement("button");
    // let btn2 = document.createElement("button");
    // let img = createimgs();
    // btn1.append(img[0]);
    // btn2.append(img[2]);
    // return [img[0], img[2]];
    let img1 = new Image("./microphone.png");
    let img2 = new Image("./video.png");
    let btn1 = document.createElement("div");
    let btn2 = document.createElement("div");
    btn1.style.height = "55px";
    btn1.onclick = muteHandler;
    btn2.onclick = muteHandler;
    btn1.setAttribute("data-type","audio");
    btn1.setAttribute("data-mute","false");
    btn1.style.width = "55px";
    btn2.setAttribute("data-type","video");
    btn2.setAttribute("data-mute","false");
    btn2.style.height = "55px";
    btn2.style.width = "55px";
    btn1.classList.add("utility-btn")
    btn2.classList.add("utility-btn")
    btn1.style.backgroundImage = `url(microphone.png)`;
    btn1.style.backgroundRepeat = `round`;
    btn2.style.backgroundImage = `url(video.png)`;
    btn2.style.backgroundRepeat = `round`;
    return [btn1, btn2];

}
const call = (username) => {
    // content.style.display = "none";
    roombox.style.display = "flex";
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        console.log(stream);
        const div = document.createElement("div");
        let video = document.createElement("video");
        let btns = buttonsmaker();
                let btn1 = btns[0];
                let btn2 = btns[1];
                btn1.setAttribute("data-key", id);
                btn2.setAttribute("data-key", id);
        video.muted=true;
        addvideostream(btn1,btn2,div,video, stream, "You");
        
        socket.on("user-connected", (userid, username) => {
            
            let call = peer.call(userid, stream);
            console.log(call);
            let bool = true;
            call.on("stream", stream => {
                const div = document.createElement("div");
                let video = document.createElement("video");
                console.log(stream);
                let btns = buttonsmaker();
                let btn1 = btns[0];
                let btn2 = btns[1];
                btn1.setAttribute("data-key", userid);
                btn2.setAttribute("data-key", userid);
                if(bool){
                    addvideostream(btn1,btn2,div, video, stream, username);
                    appendmessage(username + " : Joined ");
                }
                bool = false;
                call.on("close", () => {
                    video.remove();
                    div.remove();
                })
                videos[userid] = stream;
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
        let btns = buttonsmaker();
                let btn1 = btns[0];
                let btn2 = btns[1];
                btn1.setAttribute("data-key", Call.peer);
                btn2.setAttribute("data-key", Call.peer);
        if(bool)
        addvideostream(btn1 ,btn2,div,video, stream,usernames[Call.peer])
        bool = false;
        Call.on("close", () => {
            video.remove();
            div.remove();
        })
        videos[Call.peer] = stream;
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
const addvideostream = (btn1,btn2,div,video, stream,username) => {
    let body=document.getElementsByClassName("videogrid")[0];
    video.srcObject = stream;
    const rowdiv = document.createElement("div");
    rowdiv.classList.add("row");
    const textnode = document.createElement("h2");
    textnode.innerText = username;
    div.append(video);
    div.append(textnode);
    rowdiv.append(btn1);
    rowdiv.append(btn2);
    div.append(rowdiv);
    div.classList.add("column");
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