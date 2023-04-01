import { Menu, nativeImage, nativeTheme, Tray, ipcMain, MenuItem } from 'electron';
import path from 'path';
import { Project, Task } from '../../src/api/types';
import useRepo from './store/useRepo';

const repository = useRepo();

let contextMenu: Electron.Menu;
let tray: Tray;
let updateMenu: Electron.IpcMainEvent;
let interval: NodeJS.Timer;

repository.state$.subscribe((state) => {
  contextMenu = Menu.buildFromTemplate([
    {
      label: state.workingTask
        ? `Click to stop working ${Math.round(
            (new Date().getTime() -
              (state.workingTask?.started?.getTime?.() || new Date(state.workingTask.started).getTime())) /
              1000
          )}s`
        : 'Click to start working',
      type: 'checkbox',
      checked: !!state.workingTask,
      click: () => {
        //updateMenu.reply('start-working', Number.parseInt(task.id));
        if (!state.workingTask) {
          repository.updateWorkingTask({
            taskId: state.selectedTaskId,
            started: new Date(),
          });
        } else {
          clearInterval(interval);
          repository.updateWorkingTask(undefined);
        }
      },
    },
    {
      label: 'Task',
      type: 'submenu',
      submenu:
        state.tasks?.map((task) => ({
          id: 'task-' + task.id,
          label: task.name,
          checked: (state.selectedTaskId ? `${state.selectedTaskId}` : undefined) === task.id,
          type: 'radio',
          click(menuItem, browserWindow, event) {
            repository.updateSelectedTaskId(task.id ? Number(task.id) : undefined);
          },
        })) || [],
    },
    {
      label: 'Project',
      type: 'submenu',
      submenu:
        state.projects?.map((project) => ({
          id: project.id,
          label: project.name,
          checked: (state.selectedProjectId ? `${state.selectedProjectId}` : undefined) === project.id,
          type: 'radio',
          click(menuItem, browserWindow, event) {
            repository.updateSelectedProjectId(project.id ? Number.parseInt(project.id) : undefined);
          },
        })) || [],
    },
  ]);
  tray.setContextMenu(contextMenu);
});

export default async (app: Electron.App) => {
  let icon: Electron.NativeImage;
  if (nativeTheme.shouldUseDarkColors) {
    icon = nativeImage.createFromPath(path.join(__dirname, 'public/tray-icon-dark.png'));
  } else {
    icon = nativeImage.createFromPath(path.join(__dirname, 'public/tray-icon-light.png'));
  }
  tray = new Tray(icon);
  tray.on('balloon-show', () => {
    console.log('right-click');
  });
  ipcMain.on(
    'update-menu',
    (
      event,
      {
        projects,
        selectedProjectId,
        selectedTaskId,
        tasks,
      }: { projects: Project[]; selectedProjectId: number; tasks: Task[]; selectedTaskId: number }
    ) => {
      updateMenu = event; /* 
      repository.updateProjects(projects);
      repository.updateTasks(tasks);
      repository.updateSelectedProjectId(selectedProjectId);
      repository.updateSelectedTaskId(selectedTaskId);
      loadTrayMenu(); */
    }
  );
};
