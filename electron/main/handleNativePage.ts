import { BrowserWindow, ipcMain } from 'electron';
import useRepo from './store/useRepo';

export default (app: Electron.App) => {
  ipcMain.on('open-native-page-window', (event, arg) => {
    const loginWin = new BrowserWindow({
      title: 'Native Zentao',
      webPreferences: {},
      width: 1400,
      height: 800,
    });
    loginWin.on('close', () => {
      event.reply('window-closed', '');
    });
    loginWin.loadURL(useRepo().apiUrl_.value);
  });
};
