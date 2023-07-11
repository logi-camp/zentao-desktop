import { BrowserWindow, IpcMainEvent, ipcMain } from 'electron';
import { Subject, zip, debounceTime } from 'rxjs';
import useRepo from './store/useRepo';

const openKanbanTrigger$ = new Subject<IpcMainEvent>();

const openKanbanWinFlasher$ = new Subject<void>();

zip([openKanbanWinFlasher$, openKanbanTrigger$])
  //.pipe(distinctUntilKeyChanged(0))
  .pipe(debounceTime(1000))
  .subscribe(([_, openKanbanTrigger]) => {
    console.log('handle Login');
    const executionWin = new BrowserWindow({
      title: 'Execution',
      webPreferences: {
        webSecurity: false,
        contextIsolation: false,
      },
      width: 1400,
      height: 800,
      show: false,
    });
    executionWin.maximize();
    executionWin.on('close', () => {});
    console.log('openKanbanTrigger', openKanbanTrigger);
    executionWin.loadURL(useRepo().apiUrl_.value + `/execution-taskkanban-${openKanbanTrigger}.html`);
    executionWin.show();
    executionWin.on('close', () => {
      openKanbanWinFlasher$.next();
    });
  });

ipcMain.on('open-kanban-window', (event, data) => {
  console.log('open kan  win');
  openKanbanTrigger$.next(data);
});

export default (app: Electron.App) => {
  openKanbanWinFlasher$?.next();
};
