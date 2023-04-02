import { BrowserWindow, screen } from 'electron';
import { join } from 'path';
process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
const indexHtml = join(process.env.DIST, 'index.html#bar');
const url = process.env.VITE_DEV_SERVER_URL;

export default (app: Electron.App) => {
  let display = screen.getPrimaryDisplay();

  const win = new BrowserWindow({
    frame: false,
    type: 'toolbar',
    fullscreenable: false,
    width: 500,
    height: 24,
    x: display.bounds.width - 500,
    y: display.bounds.height - 24,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
    },
    skipTaskbar: true,
    resizable: false,
  });
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, 'floating');
  win.setMenu(null);
  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url + '/bar');
    // Open devTool if the app is not packaged
    //win.webContents.openDevTools();
  } else {
    win.loadURL(`file://${join(__dirname, '../../dist/index.html#bar')}`);
  }
  win.setSkipTaskbar(true);
  win.moveTop();
  win.show();
};
