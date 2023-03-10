
let peers = {};
let videos = {};
const socket = io('https://guarded-plateau-04700.herokuapp.com/');
// const socket = io('http://localhost:3000');
let roombox = document.getElementsByClassName("room")[0];
let roomidtext = document.getElementsByClassName("roomid")[0];
var peer = new Peer();
var id="";
var usernames = {};
const chatsection=document.getElementsByClassName("chatsection")[0];
const videosecion=document.getElementsByClassName("videosection")[0];
let i = 0;
let j=4;

    
    if(window.innerWidth>500){
        j = 3;
    }
    else{
        j = 2;
    }

const closeChats = () => {
    chatsection.style.display = "none";
    videosecion.style.display = "flex";
}
const openChats = () => {
    chatsection.style.display = "flex";
    videosecion.style.display = "none";
    
}
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
    btn.classList.toggle("muted");
        if (btn.getAttribute("data-type") == "audio") {
            if (btn.getAttribute("data-mute") == "true") {
                videos[btn.getAttribute("data-key")].getTracks()[0].enabled=true;
                btn.setAttribute("data-mute", "false");
               
            }
            else {
                btn.setAttribute("data-mute", "true");
                videos[btn.getAttribute("data-key")].getTracks()[0].enabled=false;
              
            }
        }
        else {
            if (btn.getAttribute("data-mute") == "true") {
                videos[btn.getAttribute("data-key")].getTracks()[1].enabled=true;
                btn.setAttribute("data-mute", "false");
               
            }
            else {
                btn.setAttribute("data-mute", "true");
                videos[btn.getAttribute("data-key")].getTracks()[1].enabled=false;
                
            }
        }
        
    
    
    
}
// socket.on("mute-his-audio", id => {
//     peers[id].mute();
// })
// socket.on("unmute-his-audio", id => {
//     peers[id].unmute();
// })
const endHandler = () => {
    // window.location.href = `http://localhost:3000`;
    window.location.href = `https://guarded-plateau-04700.herokuapp.com`;
}
const buttonsmaker = () => {
    // let btn1 = document.createElement("button");
    // let btn2 = document.createElement("button");
    // let img = createimgs();
    // btn1.append(img[0]);
    // btn2.append(img[2]);
    // return [img[0], img[2]];
    let btn1 = document.createElement("div");
    let btn2 = document.createElement("div");
    let btn3 = document.createElement("div");
    let btn4 = document.createElement("div");
    btn1.style.height = "55px";
    btn3.style.height = "55px";
    btn4.style.height = "55px";
    btn1.onclick = muteHandler;
    btn2.onclick = muteHandler;
    btn3.onclick = endHandler;
    btn4.onclick = openChats;
    btn1.setAttribute("data-type","audio");
    btn1.setAttribute("data-mute","false");
    btn1.style.width = "55px";
    btn3.style.width = "55px";
    btn4.style.width = "55px";
    btn2.setAttribute("data-type","video");
    btn2.setAttribute("data-mute","false");
    btn2.style.height = "55px";
    btn2.style.width = "55px";
    btn1.classList.add("utility-btn")
    btn3.classList.add("utility-btn")
    btn4.classList.add("utility-btn")
    btn4.classList.add("chat-btn")
    btn2.classList.add("utility-btn")
    btn1.style.backgroundImage = `url(microphone.png)`;
    btn3.style.backgroundImage = `url(phone.png)`;
    btn4.style.backgroundImage = `url(comment.png)`;
    btn1.style.backgroundRepeat = `round`;
    btn3.style.backgroundRepeat = `round`;
    btn4.style.backgroundRepeat = `round`;
    btn2.style.backgroundImage = `url(video.png)`;
    btn2.style.backgroundRepeat = `round`;
    return [btn1, btn2,btn3,btn4];

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
        let btn3 = btns[2];
        let btn4 = btns[3];
                btn1.setAttribute("data-key", id);
                btn2.setAttribute("data-key", id);
        video.muted = true;
        const rowdiv = document.createElement("div");
        rowdiv.classList.add("row");
        rowdiv.append(btn1);
        rowdiv.append(btn2);
        rowdiv.append(btn3);
        rowdiv.append(btn4);
        document.getElementsByClassName("options")[0].append(rowdiv);
        addvideostream(div,video, stream, "You");
        videos[id] = stream;
        socket.on("user-connected", (userid, username) => {
            
            let call = peer.call(userid, stream);
            console.log(call);
            let bool = true;
            call.on("stream", stream => {
                const div = document.createElement("div");
                let video = document.createElement("video");
                console.log(stream);
                // let btns = buttonsmaker();
                // let btn1 = btns[0];
                // let btn2 = btns[1];
                // btn1.setAttribute("data-key", userid);
                // btn2.setAttribute("data-key", userid);
                if(bool){
                    addvideostream(div, video, stream, username);
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
        // let btns = buttonsmaker();
        //         let btn1 = btns[0];
        //         let btn2 = btns[1];
        //         btn1.setAttribute("data-key", Call.peer);
        //         btn2.setAttribute("data-key", Call.peer);
        if(bool)
        addvideostream(div,video, stream,usernames[Call.peer])
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
    delete peers[userid];
    let ovl = Object.values(peers).length;
    if (j - 1 == ovl % j) {
        let vgd = document.getElementsByClassName("videogrid")[i];
        vgd.remove();
        i--;
    }
})
socket.on("usersdata", usernamedata => {
    console.log(usernamedata);
    usernames = {...usernamedata};
})
const addvideostream = (div, video, stream, username) =>{
    let ovl = Object.values(peers).length;
    if ( ovl% j == 0&&ovl!=0) {
        let newdiv = document.createElement("div");
        newdiv.classList.add("videogrid");
        let vdc = document.getElementsByClassName("vgc")[0];
        vdc.append(newdiv);
        i++;
    }
    let body=document.getElementsByClassName("videogrid")[i];
    video.srcObject = stream;
    
    const textnode = document.createElement("h2");
    textnode.innerText = username;
    div.append(video);
    div.append(textnode);
    
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

const appendmessage = (message,bool) => {
    const textnode = document.createElement("h3");
    if (bool) textnode.classList.add("L");
    else textnode.classList.add("R");
    textnode.innerText = message;
    chats.append(textnode);
}
sendbtn.onclick = () => {
    socket.emit("message-send", Message.value);
    appendmessage("You :"+Message.value,0);
    Message.value = "";
}
socket.on("message-recieved",(username, message) => {
    appendmessage(username+" : "+message,1);
})