export function openDevTool(win: Electron.BrowserWindow, isOpen: boolean) {
  if (isOpen) {
    win.webContents.openDevTools();
  } else {
    win.webContents.on('devtools-opened', () => {
      win.webContents.closeDevTools();
    });
  }
}
