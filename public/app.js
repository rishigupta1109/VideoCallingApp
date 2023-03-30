const Socket = io("https://meethub.onrender.com");
// const Socket = io("http://localhost:3000");
// var peer = new Peer();
// var id;
// peer.on('open', function (i) {
//     id = i;
// });
// let peers = {};
let createmeetbtn = document.getElementById("create-meet-btn");
let joinmeetbtn = document.getElementById("join-meet-btn");
// let roomidtext = document.getElementsByClassName("roomid")[0];
let content = document.getElementsByClassName("content")[0];
// let roombox = document.getElementsByClassName("room")[0];
createmeetbtn.onclick = () => {
  // let username = prompt("username: ");
  // Socket.emit("create-room",id,username);
  Socket.emit("create-room");
};
Socket.on("room-created", (roomid) => {
  //   window.location.href = `http://localhost:3000/${roomid}`;
  window.location.href = `https://meethub.onrender.com/${roomid}`;
  // console.log(roomid);
  // roomidtext.innerText += roomid;
});

const join = () => {
  let roomid = document.getElementById("roomid").value;
  window.location.href = `https://meethub.onrender.com/${roomid}`;
  //   window.location.href = `http://localhost:3000/${roomid}`;
  // let username = prompt("username: ");
  // Socket.emit("join-room",id,roomid,username);
  // call();
  // roomidtext.innerText += roomid;
};
joinmeetbtn.onclick = join;
// const call = () => {
//     content.style.display = "none";
//     roombox.style.display = "flex";
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {

//         let video = document.createElement("video");
//         video.muted=true;
//         addvideostream(video, stream)

//         socket.on("user-connected", (userid,username) => {
//             let call = peer.call(userid, stream);
//             console.log(call);
//             let bool = true;
//             call.on("stream", stream => {
//                 let video = document.createElement("video");
//                 console.log(stream);
//                 if(bool)
//                 addvideostream(video, stream)
//                 bool = false;
//                 call.on("close", () => {
//                     video.remove();
//                 })
//             })

//             peers[userid] = call;
//         })
//         peer.on("call", call => {
//             console.log("hello", call);
//             answercall(call, stream);
//         })

//     })
// }

// const answercall = (Call, stream) => {
//     console.log(Call);
//     Call.answer(stream);
//     let bool = true;
//     Call.on("stream", stream => {
//         let video = document.createElement("video");
//         if(bool)
//         addvideostream(video, stream)
//         bool = false;
//         Call.on("close", () => {
//             video.remove();
//         })
//     })
//     peers[Call.peer] = Call;

// }
// socket.on("user-disconnected", (userid) => {
//     console.log(peers[userid], userid);
//     let target = peers[userid];
//     target.close();
// })
// const addvideostream = (video, stream) => {
//     let body=document.getElementsByClassName("videogrid")[0];
//     video.srcObject = stream;
//     body.append(video);
//     video.play();
// }
