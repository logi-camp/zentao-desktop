import { BrowserWindow, ipcMain } from 'electron';
import { Subject, map, scan, zip, distinct, distinctUntilKeyChanged, combineLatest, debounceTime } from 'rxjs';
import useRepo from './store/useRepo';

const loginTrigger$ = new Subject<void>();

const loginFlasher$ = new Subject<void>();
const loginFlashChecker$ = loginFlasher$.pipe(
  scan(function (acc, value) {
    return acc + 1;
  }, 1)
);

zip([loginFlashChecker$, loginTrigger$])
  .pipe(
    map((v) => {
      console.log('loginPipe', v);
      return v;
    })
  )
  .pipe(distinctUntilKeyChanged(0))
  .pipe(debounceTime(1000))
  .subscribe((val) => {
    const loginWin = new BrowserWindow({
      title: 'Login',
      webPreferences: {
        webSecurity: false,
      },
      width: 1200,
      height: 600,
      show: false,
    });
    loginWin.on('close', () => {});
    loginWin.webContents.addListener('will-navigate', (event, url) => {
      console.log('url', url);
      if (url === 'https://zentao.logicamp.top/') {
        loginWin.close();
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
      //console.log('reqHeader', details.requestHeaders['Cookie']);
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
    loginWin.loadURL('https://zentao.logicamp.top/user-login.html');
    loginWin.show();
  });

ipcMain.on('open-login-window', () => {
  console.log('loginTrigger');
  loginTrigger$.next();
});

export default (app: Electron.App, mainWindow: BrowserWindow) => {
  loginFlasher$.next();
};
