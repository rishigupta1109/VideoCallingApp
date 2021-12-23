let peers = {};
const socket = io('https://guarded-plateau-04700.herokuapp.com/');
// const socket = io('http://localhost:3000');
let roombox = document.getElementsByClassName("room")[0];
let roomidtext = document.getElementsByClassName("roomid")[0];
var peer = new Peer();
var id="";

const call = () => {
    // content.style.display = "none";
    roombox.style.display = "flex";
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        
        let video = document.createElement("video");
        video.muted=true;
        addvideostream(video, stream)
        
        socket.on("user-connected", (userid,username) => {
            let call = peer.call(userid, stream);
            console.log(call);
            let bool = true;
            call.on("stream", stream => {
                let video = document.createElement("video");
                console.log(stream);
                if(bool)
                addvideostream(video, stream)
                bool = false;
                call.on("close", () => {
                    video.remove();
                })
            })

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
        let video = document.createElement("video");
        if(bool)
        addvideostream(video, stream)
        bool = false;
        Call.on("close", () => {
            video.remove();
        })
    })
    peers[Call.peer] = Call;
    
}
socket.on("user-disconnected", (userid) => {
    console.log(peers[userid], userid);
    let target = peers[userid];
    target.close();
})
const addvideostream = (video, stream) => {
    let body=document.getElementsByClassName("videogrid")[0];
    video.srcObject = stream;
    body.append(video);
    video.play();
}

const Join = () => {
    let roomid = ROOM_ID;
    let username = prompt("username: ");
    socket.emit("join-room",id,roomid,username);
    call();
    roomidtext.innerText += roomid;
}
peer.on('open', function (i) {
    id = i;
    console.log("ID", id);
    Join();
});