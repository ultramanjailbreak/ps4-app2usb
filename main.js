const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const net = require('net');

function createWindow() {
    const win = new BrowserWindow({
        width: 450,
        height: 550,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile('index.html');
}

// Listen for network payload demands from the frontend window UI
ipcMain.handle('send-ps4-notification', async (event, { ip, message }) => {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        
        // Defaulting connection execution out to Port 744 (ps4debug-NG)
        client.connect(744, ip, () => {
            const CMD_NOTIFY = 0xBFDE0043;
            const messageBytes = Buffer.from(message + '\0', 'utf-8'); // Null-terminated string
            
            // Build the standard binary structure layout
            const payloadLength = 12 + messageBytes.length;
            const buffer = Buffer.alloc(payloadLength);
            
            buffer.writeUInt32LE(CMD_NOTIFY, 0);          // ps4debug Command
            buffer.writeUInt32LE(0, 4);                   // Notification Type ID
            buffer.writeUInt32LE(messageBytes.length, 8); // Data packet size segment
            messageBytes.copy(buffer, 12);                // Message insertion point
            
            client.write(buffer, () => {
                client.end();
                resolve({ success: true });
            });
        });

        client.on('error', (err) => {
            client.destroy();
            reject(err.message);
        });

        // Safeguard connection hang timeout thresholds
        client.setTimeout(4000);
        client.on('timeout', () => {
            client.destroy();
            reject('Connection timeout! Validate IP configurations or PS4 payload status.');
        });
    });
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
