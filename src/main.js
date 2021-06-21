const {app, BrowserWindow} = require('electron')
const server = require("./server.js");
require('colors');


const port = process.env.PORT || 3000;

let url = process.env.URL;
let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({
        frame: false,
        width: 1280,
        height: 720,
        fullscreenable: false,
        titleBarStyle: "customButtonsOnHover",
        webPreferences: {
            nativeWindowOpen: true
          }
    });

    if(url) mainWindow.loadURL(url);

    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.webContents.insertCSS('html,*{ -webkit-app-region: drag; }');
    });

    mainWindow.webContents.on('new-window', (event, newUrl, frameName, disposition, options) => {
        event.preventDefault()

        Object.assign(options, {
            frame: true,
            titleBarStyle: "default",
            webContents: options.webContents, // use existing webContents if provided
            show: false
        })

        const newWindow = new BrowserWindow(options);

        newWindow.once('ready-to-show', () => newWindow.show())
        
        if (!options.webContents) {
            newWindow.loadURL(newUrl) // existing webContents will be navigated automatically
        }
        event.newGuest = newWindow
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

server.onKey = (action, payload) => {
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
        case "load":
            if(payload) try {
                url = payload.url;
                mainWindow.loadURL(url);
            } catch(err) {
                console.error(`Failed to load: '${url}'`.red);
            }
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