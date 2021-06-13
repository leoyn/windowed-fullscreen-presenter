const query = new URLSearchParams(window.location.search);

const socket = io.connect("/", {
    query: "token=" + query.get("token")
})

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


document.querySelector("#load").addEventListener("click", (evt) => {
    socket.emit("navigation", {
        action: "load",
        payload: {
            url: document.querySelector("#url").value
        }
    });
});

socket.on("meta", (data) => {
    document.querySelector("#userCount").textContent = data.connectedUsers;
});

socket.on("error", error => {
    alert(error.message);
    window.location.reload();
});