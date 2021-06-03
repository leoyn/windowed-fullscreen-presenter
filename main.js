const {app, BrowserWindow} = require('electron')
const path = require('path')
const server = require("./server.js");
const colors = require('colors');


const port = process.env.PORT || 3000;

let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({
        frame: false,
        width: 1280,
        height: 720,
        webPreferences: {
        preload: path.join(__dirname, 'preload.js')
        },
        fullscreenable: false,
        titleBarStyle: "customButtonsOnHover",
    })

    mainWindow.loadURL(process.env.URL)


    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.webContents.insertCSS('html,iframe{ -webkit-app-region: drag; }');
    });
}

app.whenReady().then(() => {
  createWindow()
  
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

server.onKey = (action) => {
    let keyCode;

    switch(action) {
        case "next":
            keyCode = "Right"; 
            break;

        case "previous":
            keyCode = "Left"; 
            break;
        
        case "reload":
            mainWindow.reload();
            break;
    }

    if(keyCode) {
        mainWindow.webContents.sendInputEvent({type:"keyDown",keyCode:keyCode});
        mainWindow.webContents.sendInputEvent({type:"keyUp",keyCode:keyCode});
    }
}

server.listen(port).then(token => {
    console.log("Control your presentation remotely by visiting:\n".yellow);
    console.log(`\thttp://127.0.0.1:${port}/?token=${token}\n\n`.green);
});