const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendNotification: (data) => ipcRenderer.invoke('send-ps4-notification', data)
});
