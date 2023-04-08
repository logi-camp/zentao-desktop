import { BrowserWindow } from 'electron';
import useRepo from './store/useRepo';
import { join } from 'path';
process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
const url = process.env.VITE_DEV_SERVER_URL;
let win: Electron.BrowserWindow | null;

export default (app: Electron.App) => {
  /* ipcMain.on('open-effort-detail-dialog', (event) => {
    const win = new BrowserWindow({
      //frame: false,
      //type: 'toolbar',
      width: 340,
      height: 140,
      //x: display.bounds.width - 24,
      //y: display.bounds.height - 580,
      fullscreenable: false,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
        contextIsolation: false,
      },
      skipTaskbar: true,
      resizable: false,
      //transparent: true,
    });
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    win.setAlwaysOnTop(true, 'floating');
    win.setMenu(null);
    if (process.env.VITE_DEV_SERVER_URL) {
      // electron-vite-vue#298

      win.loadURL(`${url}#working-task-dialog`);
      // Open devTool if the app is not packaged
      //win.webContents.openDevTools();
    } else {
      win.loadURL(`file://${join(__dirname, '../../dist/index.html#working-task-dialog')}`);
    }

    win.webContents.addListener('ipc-message', (_event, message, data) => {
      if (message === 'dialog-submit') {
        event.reply('open-effort-detail-dialog-reply', data);
        win.close();
      }
    });
    win.setSkipTaskbar(true);
    win.moveTop();
    win.show();
  }); */
  useRepo().effortDetailDialogIsVisible$.subscribe((show) => {
    if (show) {
      win = new BrowserWindow({
        //frame: false,
        //type: 'toolbar',
        width: 400,
        height: 200,
        //x: display.bounds.width - 24,
        //y: display.bounds.height - 580,
        fullscreenable: false,
        webPreferences: {
          nodeIntegration: true,
          webSecurity: false,
          contextIsolation: false,
        },
        skipTaskbar: true,
        //resizable: false,
        //transparent: true,
      });
      win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
      win.setAlwaysOnTop(true, 'floating');
      win.setMenu(null);
      if (process.env.VITE_DEV_SERVER_URL) {
        // electron-vite-vue#298

        win.loadURL(`${url}#working-task-dialog`);
        // Open devTool if the app is not packaged
        win.webContents.openDevTools();
      } else {
        win.loadURL(`file://${join(__dirname, '../../dist/index.html#working-task-dialog')}`);
      }

      win.webContents.addListener('ipc-message', (_event, message, data) => {
        if (message === 'dialog-submit') {
          //event.reply('open-effort-detail-dialog-reply', data);
          win.close();
          useRepo().closeEffortDetailDialog();
        }
      });
      win.setSkipTaskbar(true);
      win.moveTop();
      win.show();
      win.addListener('close', () => {
        useRepo().closeEffortDetailDialog();
      });
    } else {
      if (win && !win.isDestroyed()) win.close();
    }
  });
};
