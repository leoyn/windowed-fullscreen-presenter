const socket = io("/");

document.querySelector("#previous").addEventListener("click", (evt) => {
    socket.emit("navigation", {
       action: "previous" 
    });
});

document.querySelector("#next").addEventListener("click", (evt) => {
    socket.emit("navigation", {
       action: "next" 
    });
});

document.querySelector("#reload").addEventListener("click", (evt) => {
    if(confirm("Reload?")) socket.emit("navigation", {
       action: "reload"
    });
});

socket.on("meta", (data) => {
    document.querySelector("#userCount").textContent = data.connectedUsers;
});