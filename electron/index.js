const { app, BrowserWindow } = require('electron');
const { fork } = require('child_process');
const electron = require('electron');
const findOpenSocket = require('./find-open-socket');
const isDev = require('electron-is-dev');

let clientWin
let serverWin
let serverProcess

function createWindow(socketName) {
  clientWin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + '/client-preload.js'
    }
  })
  
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../react/build/index.html'),
    protocol: 'file:',
    slashes: true
  });

  console.log(startUrl)

  clientWin.loadURL(startUrl);

  clientWin.webContents.on('did-finish-load', () => {
    clientWin.webContents.send('set-socket', { name: socketName });
  });
}

function createBackgroundWindow(socketName) {
  const win = new BrowserWindow({
    x: 500,
    y: 300,
    width: 700,
    height: 500,
    show: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadURL(`file://${__dirname}/server-dev.html`);

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('set-socket', { name: socketName });
  });

  serverWin = win;
}

function createBackgroundProcess(socketName) {
  serverProcess = fork(__dirname + '/server.js', [
    '--subprocess',
    app.getVersion(),
    socketName
  ]);

  serverProcess.on('message', msg => {
    console.log(msg);
  });
}

app.on('ready', async () => {
  const serverSocket = await findOpenSocket();

  createWindow(serverSocket);

  if (isDev) {
    createBackgroundWindow(serverSocket);
  } else {
    createBackgroundProcess(serverSocket);
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});
