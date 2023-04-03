import { BrowserWindow } from 'electron';
import { Subject, map, scan, zip, distinct, distinctUntilKeyChanged, combineLatest, debounceTime } from 'rxjs';
import useRepo from './store/useRepo';
import { join } from 'path';
const url = process.env.VITE_DEV_SERVER_URL;

export default (app: Electron.App, mainWindow: BrowserWindow) => {
  useRepo()
    .workingTaskDialogIsVisible$.pipe(
      map((v) => {
        console.log('loginPipe', v);
        return v;
      })
    )
    //.pipe(distinct())
    .pipe(debounceTime(1000))
    .subscribe(() => {
      const dialogWin = new BrowserWindow({
        title: 'Working Task',
        webPreferences: {
          webSecurity: false,
        },
        width: 400,
        height: 160,
        show: false,
      });

      if (process.env.VITE_DEV_SERVER_URL) {
        // electron-vite-vue#298
        dialogWin.loadURL(`${url}#workingtaskdialog`);
        // Open devTool if the app is not packaged
        //win.webContents.openDevTools();
      } else {
        dialogWin.loadURL(`file://${join(__dirname, '../../dist/index.html#workingtaskdialog')}`);
      }

      dialogWin.show();
      dialogWin.addListener('close', () => {
        useRepo().dialogClosed();
      });
    });
};
