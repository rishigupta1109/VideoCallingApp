const express = require("express");
const app = express();
const { v4: uuidV4 } = require("uuid");
const server = require("http").createServer(app);
const { ExpressPeerServer } = require("peer");
const io = require("socket.io")(server, { cors: { origin: "*" } });
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/myapp",
});
peerServer.on("connection", (client) => {
  console.log("peer connecetd", client.getId());
});
peerServer.on("disconnect", (client) => {
  console.log("peer disconnected", client.getId());
});
app.use("/peerjs", peerServer);
app.set("view engine", "ejs");
app.use(express.static("public"));
let record = {};
let users = {};
let usernamesdata = {};
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/:room", (req, res) => {
  res.render("conferenceroom", { roomId: req.params.room });
});
io.on("connection", (socket) => {
  socket.on("create-room", () => {
    console.log("create-room");
    let room = uuidV4();
    // record[socket.id] = room;
    // users[socket.id] = id;
    // usernamesdata[id] = username;
    io.to(socket.id).emit("room-created", room);
    // console.log("userid",id);
    // console.log("username",username);
    // socket.join(room);
  });
  socket.on("join-room", (userid, roomid, username) => {
    console.log("userid", userid);
    console.log("username", username);
    console.log("roomid", roomid);
    socket.join(roomid);
    usernamesdata[userid] = username;
    record[socket.id] = roomid;
    users[socket.id] = userid;
    io.to(socket.id).emit("usersdata", usernamesdata);
    socket.to(roomid).emit("user-connected", userid, username);
  });
  socket.on("message-send", (message) => {
    socket
      .to(record[socket.id])
      .emit("message-recieved", usernamesdata[users[socket.id]], message);
  });
  socket.on("disconnect", () => {
    socket.to(record[socket.id]).emit("user-disconnected", users[socket.id]);
    delete usernamesdata[users[socket.id]];
    delete record[socket.id];
    delete users[socket.id];
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("server is listening");
});
