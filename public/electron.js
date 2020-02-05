const {app, BrowserWindow, Menu, Tray} = require('electron');
const isDev = require('electron-is-dev');
const path = require("path");
const url = require("url");
const {autoUpdater} = require('electron-updater');
let mainWindow;
let tray;
const IconPathProduction = path.join(__dirname, './assets/icons/icon.png');
const IconPathStaging = path.join(__dirname, './assets/icons/icon.png');
const LoadUrlLocal = "http://localhost:3000";


const LoadUrlLocalProduction = url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true
})


function getWindowIcon() {
    return isDev ? IconPathStaging : IconPathProduction
}

function getWindowLoadUrl() {
    return isDev ? LoadUrlLocal : LoadUrlLocalProduction;
}

function getWindowOption() {
    // Create a new window
    return new BrowserWindow({
            maximizable: false,
            height: 600,
            width: 350,
            // Take care of Opacity for window and Mac
            // if opacity 0 then app maybe not visible in window or mac
            x: 200,
            y: 100,

            transparent: true,
            frame: false,

            movable: true,
            icon: getWindowIcon(),
            webPreferences: {
                nodeIntegration: true,
                devTools: true,
            }
        }
    )
}

// Create a new Tray
function createTrayIcon() {
    tray = new Tray(getWindowIcon())
    let contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App',
            click: () => {
                mainWindow.restore()
                mainWindow.show()
            }
        },
        {
            label: 'Minimized',
            click: () => {
                mainWindow.minimize()
            }
        }
        ,
        {
            label: 'Quit',
            click: () => {
                app.quit()
            }
        }
    ]);
    tray.setToolTip('tpss-electron')
    tray.setContextMenu(contextMenu);
    tray.on('right-click', toggleWindow)
    tray.on('double-click', toggleWindow)
    tray.on('click', function (event) {
        toggleWindow()
    })

}

// toggle window
const toggleWindow = () => {
    if (mainWindow.isVisible()) {
        mainWindow.minimize()
    } else {
        showWindow()
    }
}

const showWindow = () => {
    mainWindow.show()
    mainWindow.focus()
}

function createWindow() {
    createTrayIcon()
    mainWindow = getWindowOption();
    //if(isDev)
  //  mainWindow.webContents.openDevTools()
    mainWindow.loadURL(getWindowLoadUrl());
    mainWindow.on("closed", () => (mainWindow = null));
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
        mainWindow.focus()
    })

    // Hide the window when it loses focus
    mainWindow.on('blur', () => {
        // mainWindow.minimize()
    })
    return mainWindow;
}


app.on('ready', () => {
    autoUpdater.checkForUpdatesAndNotify();
    createWindow()
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});


/////////Auto Updater for app////////

function sendStatusToWindow(text) {
    log.info(text);
    mainWindow.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
});