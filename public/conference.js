let username = prompt("username: ");
window.onbeforeunload = (e) => {
  e.preventDefault();
  const message =
    "Are you sure you want to leave? All provided data will be lost.";
  e.returnValue = message;
  return message;
};
const loader = document.getElementsByClassName("loader")[0];
loader.style.display = "flex";
console.log(ROOM_ID);
let peers = {};
let videos = {};
// const socket = io("https://meethub.onrender.com");
const socket = io(window.location.origin);
let roombox = document.getElementsByClassName("room")[0];
let roomidtext = document.getElementsByClassName("roomid")[0];
try {
  // var peer = new Peer(username, {
  //   host: "localhost",
  //   port: 3000,
  //   path: "peerjs/myapp",
  // });
  var peer = new Peer({
    host: window.location.hostname,
    port: window.location.port,
    path: "/peerjs/myapp",
  });
  // var peer = new Peer({
  //   host: "meethub.onrender.com",
  //   port: "",
  //   path: "/peerjs/myapp",
  // });
  peer.on("open", function (i) {
    id = i;
    console.log("ID", id);
    loader.style.display = "none";
    Join();
  });

  console.log(peer);
} catch (err) {
  console.log(err);
}
var id = "";
var usernames = {};
const chatsection = document.getElementsByClassName("chatsection")[0];
const videosecion = document.getElementsByClassName("videosection")[0];
let i = 0;
let j = 4;

if (window.innerWidth > 500) {
  j = 3;
} else {
  j = 2;
}

const closeChats = () => {
  chatsection.style.display = "none";
  videosecion.style.display = "flex";
};
const openChats = () => {
  document.getElementsByClassName("chat-btn")[0].setAttribute("data-count", "");
  document.getElementsByClassName("chat-btn")[0].setAttribute("data-pad", "0");
  chatsection.style.display = "flex";
  videosecion.style.display = "none";
  document.getElementById("message").focus();
};
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
      videos[btn.getAttribute("data-key")].getTracks()[0].enabled = true;
      btn.setAttribute("data-mute", "false");
    } else {
      btn.setAttribute("data-mute", "true");
      videos[btn.getAttribute("data-key")].getTracks()[0].enabled = false;
    }
  } else {
    if (btn.getAttribute("data-mute") == "true") {
      videos[btn.getAttribute("data-key")].getTracks()[1].enabled = true;
      btn.setAttribute("data-mute", "false");
    } else {
      btn.setAttribute("data-mute", "true");
      videos[btn.getAttribute("data-key")].getTracks()[1].enabled = false;
    }
  }
};
// socket.on("mute-his-audio", id => {
//     peers[id].mute();
// })
// socket.on("unmute-his-audio", id => {
//     peers[id].unmute();
// })
const endHandler = () => {
  window.location.href = `${window.location.origin}`;
  // window.location.href = `https://meethub.onrender.com/`;
};
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
  btn1.setAttribute("data-type", "audio");
  btn1.setAttribute("data-mute", "false");
  btn1.style.width = "55px";
  btn3.style.width = "55px";
  btn4.style.width = "55px";
  btn2.setAttribute("data-type", "video");
  btn2.setAttribute("data-mute", "false");
  btn2.style.height = "55px";
  btn2.style.width = "55px";
  btn1.classList.add("utility-btn");
  btn3.classList.add("utility-btn");
  btn4.classList.add("utility-btn");
  btn4.classList.add("chat-btn");
  btn2.classList.add("utility-btn");
  btn1.style.backgroundImage = `url(microphone.png)`;
  btn1.style.filter = `invert(1)`;
  btn2.style.filter = `invert(1)`;
  // btn3.style.filter = `invert(1)`;
  btn4.style.filter = `invert(1)`;
  btn3.style.backgroundImage = `url(phone.png)`;
  btn4.style.backgroundImage = `url(comment.png)`;
  btn1.style.backgroundRepeat = `round`;
  btn3.style.backgroundRepeat = `round`;
  btn4.style.backgroundRepeat = `round`;
  btn2.style.backgroundImage = `url(video.png)`;
  btn2.style.backgroundRepeat = `round`;
  return [btn1, btn2, btn3, btn4];
};
roombox.style.display = "flex";
navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
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
    // const rowdiv = document.createElement("div");
    const rowdiv = document.getElementsByClassName("utilityButtons  ")[0];
    rowdiv.classList.add("row");
    rowdiv.append(btn1);
    rowdiv.append(btn2);
    rowdiv.append(btn4);
    rowdiv.append(btn3);
    document.getElementsByClassName("options")[0].append(rowdiv);
    addvideostream(div, video, stream, "You");
    videos[id] = stream;
    socket.on("user-connected", (userid, username) => {
      console.log(userid, "usersss");
      let call = peer.call(userid, stream);
      console.log(call);
      let bool = true;
      call.on("stream", (stream) => {
        const div = document.createElement("div");
        let video = document.createElement("video");
        console.log(stream);
        // let btns = buttonsmaker();
        // let btn1 = btns[0];
        // let btn2 = btns[1];
        // btn1.setAttribute("data-key", userid);
        // btn2.setAttribute("data-key", userid);
        if (bool) {
          addvideostream(div, video, stream, username);
          appendmessage(username + " : Joined ");
        }
        bool = false;
        call.on("close", () => {
          Array.from(document.getElementsByClassName("column")).forEach(
            (el) => {
              el.style.width = `${
                100 / (Object.keys(videos).length - 1) < 25
                  ? 25
                  : 100 / (Object.keys(videos).length - 1)
              }%`;
            }
          );
          video.remove();
          div.remove();
        });
        videos[userid] = stream;
        Array.from(document.getElementsByClassName("column")).forEach((el) => {
          el.style.width = `${
            100 / Object.keys(videos).length < 25
              ? 25
              : 100 / Object.keys(videos).length
          }%`;
        });
        console.log(window.innerWidth);
        if (window.innerWidth < 500 && Object.keys(videos).length <= 2) {
          Array.from(document.getElementsByClassName("column")).forEach(
            (el) => {
              el.style.width = `100%`;
            }
          );
        }
      });
      usernames[userid] = username;
      peers[userid] = call;
    });
  });
const call = (username) => {
  // content.style.display = "none";
};
var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;
peer.on("call", (call) => {
  console.log("hello", call);
  getUserMedia({ video: true, audio: true }, (stream) => {
    console.log(stream);

    answercall(call, stream);
  });
});

const answercall = (Call, stream) => {
  console.log(Call);
  Call.answer(stream);
  let bool = true;
  Call.on("stream", (stream) => {
    console.log(stream);
    console.log(usernames[Call.peer]);
    const div = document.createElement("div");
    let video = document.createElement("video");
    // let btns = buttonsmaker();
    //         let btn1 = btns[0];
    //         let btn2 = btns[1];
    //         btn1.setAttribute("data-key", Call.peer);
    //         btn2.setAttribute("data-key", Call.peer);
    if (bool) addvideostream(div, video, stream, usernames[Call.peer]);
    bool = false;
    Call.on("close", () => {
      Array.from(document.getElementsByClassName("column")).forEach((el) => {
        el.style.width = `${
          100 / (Object.keys(videos).length - 1) < 25
            ? 25
            : 100 / (Object.keys(videos).length - 1)
        }%`;
      });
      video.remove();
      div.remove();
    });
    videos[Call.peer] = stream;
    Array.from(document.getElementsByClassName("column")).forEach((el) => {
      el.style.width = `${
        100 / Object.keys(videos).length < 25
          ? 25
          : 100 / Object.keys(videos).length
      }%`;
    });
    console.log(window.innerWidth);
    if (window.innerWidth < 500 && Object.keys(videos).length <= 2) {
      Array.from(document.getElementsByClassName("column")).forEach((el) => {
        el.style.width = `100%`;
      });
    }
  });

  peers[Call.peer] = Call;
};
window.onresize = () => {
  console.log(window.innerWidth);
  if (window.innerWidth < 500 && Object.keys(videos).length <= 2) {
    Array.from(document.getElementsByClassName("column")).forEach((el) => {
      el.style.width = `100%`;
    });
  }
};

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
});
socket.on("usersdata", (usernamedata) => {
  console.log(usernamedata);
  usernames = { ...usernamedata };
});
const addvideostream = (div, video, stream, username) => {
  let ovl = Object.values(peers).length;
  if (ovl % j == 0 && ovl != 0) {
    let newdiv = document.createElement("div");
    newdiv.classList.add("videogrid");
    let vdc = document.getElementsByClassName("vgc")[0];
    vdc.append(newdiv);
    i++;
  }
  let body = document.getElementsByClassName("videogrid")[i];
  video.srcObject = stream;

  const textnode = document.createElement("h2");
  textnode.innerText = username;
  div.append(video);
  div.append(textnode);

  div.classList.add("column");
  body.append(div);
  video.play();
};

const Join = () => {
  let roomid = ROOM_ID;
  console.log(roomid);
  socket.emit("join-room", id, roomid, username);
  call(username);
  roomidtext.innerText += roomid;
};

//Messaging part

let sendbtn = document.getElementById("send");
let Message = document.getElementById("message");
let chats = document.getElementById("chats");

const appendmessage = (message, bool) => {
  const textnode = document.createElement("h3");
  if (bool) textnode.classList.add("L");
  else textnode.classList.add("R");
  textnode.innerText = message;
  chats.append(textnode);
};
const sendMessage = () => {
  socket.emit("message-send", Message.value);
  appendmessage("You : " + Message.value, 0);
  Message.value = "";
};
document.getElementById("message").onkeydown = (e) => {
  console.log(e);
  if (e.code == "Enter") {
    sendMessage();
  }
};
sendbtn.onclick = sendMessage;
socket.on("message-recieved", (username, message) => {
  appendmessage(username + " : " + message, 1);
  document
    .getElementsByClassName("chat-btn")[0]
    .setAttribute("data-count", "!");
  document.getElementsByClassName("chat-btn")[0].setAttribute("data-pad", "1");
});

const copyLink = async () => {
  console.log("hello");
  try {
    await navigator.clipboard.writeText(window.location.href);
  } catch (e) {
    console.log(e);
  }
  alert("Link Copied");
};
