import { Menu, nativeImage, nativeTheme, Tray, ipcMain, MenuItem } from 'electron';
import path from 'path';
import { Project, Task } from '../../src/zentao-api/src/types';
import { repository } from '../../src/store/store';

let contextMenu: Electron.Menu;
let tray: Tray;
let updateMenu: Electron.IpcMainEvent;

const loadTrayMenu = () => {
  repository.menuState$.subscribe((state) => {
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
              interval: setInterval(() => {
                loadTrayMenu();
              }, 1000),
            });
          } else {
            clearInterval(state.workingTask.interval);
            repository.updateWorkingTask(undefined);
            loadTrayMenu();
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
              updateMenu.reply('select-task', Number.parseInt(task.id));
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
              updateMenu.reply('select-project', Number.parseInt(project.id));
            },
          })) || [],
      },
    ]);
  });

  tray.setContextMenu(contextMenu);
};

export default async (app: Electron.App) => {
  let icon: Electron.NativeImage;
  if (nativeTheme.shouldUseDarkColors) {
    icon = nativeImage.createFromPath(path.join(__dirname, 'public/tray-icon-dark.png'));
  } else {
    icon = nativeImage.createFromPath(path.join(__dirname, 'public/tray-icon-light.png'));
  }
  tray = new Tray(icon);
  loadTrayMenu();
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
      updateMenu = event;
      repository.updateProjects(projects);
      repository.updateTasks(tasks);
      repository.updateSelectedProjectId(selectedProjectId);
      repository.updateSelectedTaskId(selectedTaskId);
      loadTrayMenu();
    }
  );
};
