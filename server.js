const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const utils = require("./utils");

const token = utils.tokens.generate();

module.exports = {
    listen: (port) => {
        return new Promise((resolve, reject) => {
            server.on("listening", () => {
                resolve(token);
            });

            server.on("error", reject);
            server.listen(port);
        });
    },
    onKey: null,
}

let connectedUsers = 0;

io.on("connection", (socket) => {
    const handshakeData = socket.request;
    const clientToken = String(handshakeData._query.token);
    
    if(clientToken !== token) {
        socket.emit("error", {
            code: 401,
            message: "No or wrong token provided"
        });
        socket.disconnect();
    } else {
        io.emit("meta", {
            connectedUsers: ++connectedUsers
        });

        socket.on("navigation", (data) => {
            if(data.action) module.exports.onKey(data.action);
        });

        socket.on("disconnect", () => {
            io.emit("meta", {
                connectedUsers: --connectedUsers
            });
        })
    }
});

app.use(express.static("public"));