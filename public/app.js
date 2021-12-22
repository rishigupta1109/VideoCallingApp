const socket = io('http://localhost:3000');
var peer = new Peer(); 
var id;
peer.on('open', function (i) {
    id = i;
});
let peers = {};
const call = () => {
    let roomid = document.getElementById("username").value;
    socket.emit("join-room",id,roomid);
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        
        let video = document.createElement("video");
        
        addvideostream(video, stream)
        
        socket.on("user-connected", userid => {
            console.log(userid);
            let call = peer.call(userid, stream);
            let bool = true;
            call.on("stream", stream => {
                let video = document.createElement("video");
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
            answercall(call, stream);
        })

    })
}

const answercall = (Call, stream) => {
    Call.answer(stream);
    console.log(Call);
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
   
    let body=document.getElementsByTagName("body")[0];
    video.srcObject = stream;
    
        body.append(video);
  
    video.play();
}