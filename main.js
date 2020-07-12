const {app, BrowserWindow} = require('electron')
const path = require('path')

function createWindow () {
  const mainWindow = new BrowserWindow({
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