const express = require('express');
const app = express();

const server = require('http').createServer(app);

const io = require('socket.io')(server, { cors: { origin: '*' } });
app.set('view engine', 'ejs')
app.use(express.static('public'))
let record = {};
let users = {};
app.get('/', (req, res) => {
    res.render('index');
})
io.on("connection", socket => {
    socket.on("join-room", (userid, roomid) => {
        console.log(userid);
        socket.join(roomid);
        record[socket.id] = roomid;
        users[socket.id] = userid;
        socket.to(roomid).emit("user-connected",userid)
    })
    socket.on("disconnect", () => {
        socket.to(record[socket.id]).emit("user-disconnected",users[socket.id]);
    })
})

server.listen((process.env.PORT||3000), () => {
    console.log("server is listening");
})