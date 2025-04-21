const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setAlwaysOnTop: (value) => ipcRenderer.send('set-always-on-top', value)
}); 