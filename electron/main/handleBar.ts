import { BrowserWindow, screen } from 'electron';
import { join } from 'path';
import useRepo from './store/useRepo';
process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
const url = process.env.VITE_DEV_SERVER_URL;

let win: BrowserWindow;

export default (app: Electron.App) => {
  useRepo().effortBarIsVisible$.subscribe((isVisible) => {
    if (isVisible) {
      let display = screen.getPrimaryDisplay();

      win = new BrowserWindow({
        frame: false,
        type: 'toolbar',
        width: 24,
        height: 450,
        x: display.bounds.width - 24 - 22,
        y: display.bounds.height - 580,
        fullscreenable: false,
        webPreferences: {
          nodeIntegration: true,
          webSecurity: false,
          contextIsolation: false,
        },
        skipTaskbar: true,
        resizable: false,
        transparent: true,
      });
      win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
      win.setAlwaysOnTop(true, 'floating');
      win.setMenu(null);
      if (process.env.VITE_DEV_SERVER_URL) {
        // electron-vite-vue#298

        win.loadURL(`${url}#bar`);
        // Open devTool if the app is not packaged
        //win.webContents.openDevTools();
      } else {
        win.loadURL(`file://${join(__dirname, '../../dist/index.html#bar')}`);
      }
      win.setSkipTaskbar(true);
      win.moveTop();
      win.show();
    } else {
      win.close();
    }
  });
};
