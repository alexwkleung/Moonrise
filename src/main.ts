import { app, BrowserWindow } from 'electron';

const createWindow = () => {
    let mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        opacity: 0.97
    })
    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
})

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
})