import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron';

const createWindow = (): void => {
    let mainWindow = new BrowserWindow({
        width: 1440,
        height: 770,
        opacity: 0.94,
        titleBarStyle: 'hiddenInset'
    })
    mainWindow.loadFile('index.html');
}

const mac: boolean = process.platform === 'darwin';

const menu = Menu.buildFromTemplate(
  [
    //app menu
    ...(mac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []) as MenuItemConstructorOptions[],
    //file menu
    {
      label: 'File',
      submenu: [
        mac ? { role: 'close' } : { role: 'quit' }
      ] as MenuItemConstructorOptions[]
    },
    //edit menu
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(mac ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ]) as MenuItemConstructorOptions[]
      ]
    },
    //view menu
    {
      label: 'View',
      submenu: [
          { 
              role: 'toggleDevTools', 
              accelerator: 'Command+Shift+D'
          },
          { label: 'Toggle Fullscreen', role: 'togglefullscreen', accelerator: 'Command+Shift+F' },
      ]
    }
  ]
);

//set menu from template
Menu.setApplicationMenu(menu)

app.whenReady().then((): void => {
    createWindow();

    app.commandLine.appendSwitch("enable-experimental-web-platform-features");

    app.on('activate', (): void => {
        if(BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
})

app.on('window-all-closed', (): void => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
})