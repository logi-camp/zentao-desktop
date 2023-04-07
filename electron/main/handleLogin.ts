import { BrowserWindow, IpcMainEvent, ipcMain } from 'electron';
import { Subject, map, scan, zip, distinctUntilKeyChanged, debounceTime } from 'rxjs';
import useRepo from './store/useRepo';

const loginTrigger$ = new Subject<IpcMainEvent>();

const loginFlasher$ = new Subject<void>();
const loginFlashChecker$ = loginFlasher$.pipe(
  scan(function (acc, value) {
    return acc + 1;
  }, 1)
);

zip([loginFlasher$, loginTrigger$])
  //.pipe(distinctUntilKeyChanged(0))
  .pipe(debounceTime(1000))
  .subscribe(([loginFlasher, loginTrigger]) => {
    console.log('handle Login');
    const loginWin = new BrowserWindow({
      title: 'Login',
      webPreferences: {
        webSecurity: false,
        contextIsolation: false,
      },
      width: 1200,
      height: 600,
      show: false,
    });
    loginWin.on('close', () => {});
    loginWin.webContents.addListener('will-navigate', (event, url) => {
      if (url?.replace(/\//g, '') === useRepo().apiUrl_.value?.replace(/\//g, '')) {
        loginWin.close();
        loginTrigger.reply('login-finished')
        loginFlasher$.next();
      }
    });
    loginWin.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
      if (
        (details.requestHeaders['Cookie'] && details.requestHeaders['Cookie'].includes('zentaosid=')) ||
        (details.requestHeaders['cookie'] && details.requestHeaders['cookie'].includes('zentaosid='))
      ) {
        useRepo().updateCustomHeaders(
          Object.fromEntries(
            Object.entries(details.requestHeaders).filter(([key]) => key.toLocaleLowerCase() === 'cookie')
          )
        );
      }
      callback({ requestHeaders: details.requestHeaders });
    });
    loginWin.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      /* const z = details.responseHeaders['set-cookie']?.find((item) => item.includes('zentaosid='));
      if (z) {
        useRepo().updateCookies(
          z
            .split(';')
            ?.find((item) => item.includes('zentaosid='))
            .trim()
        );
      } */
      callback({ responseHeaders: details.responseHeaders });
    });
    loginWin.loadURL(useRepo().apiUrl_.value + '/user-login.html');
    loginWin.show();
  });

ipcMain.on('open-login-window', (event) => {
  console.log('open login win')
  //loginFlasher$.next();
  loginTrigger$.next(event);
});

export default (app: Electron.App) => {
  loginFlasher$?.next();
};
