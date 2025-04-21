const { app, BrowserWindow, ipcMain } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
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
ipcMain.handle('setAlwaysOnTop', (event, isAlwaysOnTop) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        win.setAlwaysOnTop(isAlwaysOnTop);
    }
}); 