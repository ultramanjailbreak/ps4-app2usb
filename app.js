document.getElementById('sendBtn').addEventListener('click', async () => {
    const ip = document.getElementById('ip').value.trim();
    const message = document.getElementById('message').value.trim();
    const statusDiv = document.getElementById('status');

    if (!ip || !message) {
        statusDiv.style.color = '#ff3333';
        statusDiv.innerText = 'Please fill out all fields.';
        return;
    }

    statusDiv.style.color = '#ffcc00';
    statusDiv.innerText = 'Connecting to PS4...';

    // Using ps4debug-NG custom TCP port 744 via WebSocket
    const wsUrl = `ws://${ip}:744`; 

    try {
        const socket = new WebSocket(wsUrl);
        socket.binaryType = 'arraybuffer';

        socket.onopen = () => {
            statusDiv.innerText = 'Sending notification...';
            
            // CMD_CONSOLE_NOTIFY API Call Hex
            const CMD_NOTIFY = 0xBFDE0043;
            
            // Encode the string text to bytes (null-terminated)
            const encoder = new TextEncoder();
            const messageBytes = encoder.encode(message + '\0');
            
            // Binary Packet length: Header (12 bytes) + Text Data
            const payloadLength = 12 + messageBytes.length; 
            const buffer = new ArrayBuffer(payloadLength);
            const view = new DataView(buffer);
            
            // Write payload layout structure
            view.setUint32(0, CMD_NOTIFY, true);          // Command code
            view.setUint32(4, 0, true);                   // Notification type (0 = standard)
            view.setUint32(8, messageBytes.length, true); // Payload text byte size
            
            // Inject message stream behind the header mapping
            const uint8View = new Uint8Array(buffer, 12);
            uint8View.set(messageBytes);
            
            // Transmit packet over the network link
            socket.send(buffer);
            
            statusDiv.style.color = '#33cc33';
            statusDiv.innerText = 'Notification sent successfully!';
            
            setTimeout(() => socket.close(), 1000);
        };

        socket.onerror = (error) => {
            console.error(error);
            statusDiv.style.color = '#ff3333';
            statusDiv.innerText = 'Connection failed! Confirm IP and verify ps4debug-NG is active on Port 744.';
        };

    } catch (err) {
        statusDiv.style.color = '#ff3333';
        statusDiv.innerText = 'Error sending packet data.';
    }
});
