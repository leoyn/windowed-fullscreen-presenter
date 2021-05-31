const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

module.exports = {
    server: server,
    onKey: null,
}

let connectedUsers = 0;

io.on("connection", (socket) => {

    connectedUsers++;

    io.emit("meta", {
        connectedUsers: connectedUsers
    });

    socket.on("navigation", (data) => {
        if(data.action) module.exports.onKey(data.action);
    });

    socket.on("disconnect", () => {
        io.emit("meta", {
            connectedUsers: --connectedUsers
        });
    });
});

app.use(express.static("public"));