document.getElementById('send').addEventListener('click', async () => {
    const ip = document.getElementById('ip').value.trim();
    const message = document.getElementById('msg').value.trim();
    const status = document.getElementById('status');

    if(!ip || !message) {
        status.style.color = '#e53e3e';
        status.innerText = 'Both entry fields are required.';
        return;
    }

    status.style.color = '#ecc94b';
    status.innerText = 'Broadcasting payload command...';

    try {
        await window.electronAPI.sendNotification({ ip, message });
        status.style.color = '#38a169';
        status.innerText = 'Notification displayed on screen!';
    } catch (error) {
        status.style.color = '#e53e3e';
        status.innerText = `Error: ${error}`;
    }
});
