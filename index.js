const express = require('express');
const app = express();
const { v4: uuidV4 } = require('uuid')
const server = require('http').createServer(app);

const io = require('socket.io')(server, { cors: { origin: '*' } });
app.set('view engine', 'ejs')
app.use(express.static('public'))
let record = {};
let users = {};
let usernamesdata = {};
app.get('/', (req, res) => {
    res.render('index');
})
io.on("connection", socket => {
    socket.on("create-room", (id, username) => {
        let room = uuidV4();
        record[socket.id] = room;
        users[socket.id] = id;
        usernamesdata[id] = username;
        io.to(socket.id).emit("room-created", room);
        console.log("userid",id);
        console.log("username",username);
        socket.join(room);
    })
    socket.on("join-room", (userid, roomid,username) => {
        console.log("userid",userid);
        console.log("username",username);
        socket.join(roomid);
        usernamesdata[userid] = username;
        record[socket.id] = roomid;
        users[socket.id] = userid;
        socket.to(roomid).emit("user-connected", userid, username);
    })
    socket.on("disconnect", () => {
        socket.to(record[socket.id]).emit("user-disconnected",users[socket.id]);
    })
})

server.listen((process.env.PORT||3000), () => {
    console.log("server is listening");
})