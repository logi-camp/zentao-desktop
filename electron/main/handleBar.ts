import { BrowserWindow, screen } from 'electron';
import { join } from 'path';
const preload = join(__dirname, '../preload/index.js');
process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
const indexHtml = join(process.env.DIST, 'index.html');
const url = process.env.VITE_DEV_SERVER_URL;

export default (app: Electron.App) => {
  let display = screen.getPrimaryDisplay();

  const win = new BrowserWindow({
    frame: false,
    type: "toolbar",
    fullscreenable: false,
    width: 500,
    height: 24,
    x: display.bounds.width - 500,
    y: display.bounds.height - 24,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
      preload,
    },
    skipTaskbar: true,
    resizable: false
  });
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, 'floating');
  win.setMenu(null)
  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url + '/bar');
    // Open devTool if the app is not packaged
    //win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }
  win.setSkipTaskbar(true);
  win.moveTop();
  win.show();
};
