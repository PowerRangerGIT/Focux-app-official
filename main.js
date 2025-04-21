const { app, BrowserWindow, ipcMain } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: require('path').join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Exponer la funcionalidad de "siempre visible" al proceso de renderizado
ipcMain.on('set-always-on-top', (event, value) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        win.setAlwaysOnTop(value);
    }
});

// Exponer la API de Electron al proceso de renderizado
global.electron = {
    setAlwaysOnTop: (isAlwaysOnTop) => {
        ipcMain.emit('set-always-on-top', null, isAlwaysOnTop);
    }
}; 