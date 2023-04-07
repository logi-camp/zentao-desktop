import { Menu } from 'electron';
import useRepo from './store/useRepo';
import useTray from './useTray';

let contextMenu: Electron.Menu;
let interval: NodeJS.Timer;

export default async (app: Electron.App) => {
  useRepo().state$.subscribe((state) => {
    contextMenu = Menu.buildFromTemplate([
      {
        label: state.persistedStates?.workingTask
          ? `Click to stop working ${Math.round(
              (new Date().getTime() -
                (state.persistedStates?.workingTask?.started?.getTime?.() ||
                  new Date(state.persistedStates?.workingTask?.started).getTime())) /
                1000
            )}s`
          : 'Click to start working',
        type: 'checkbox',
        checked: !!state.persistedStates?.workingTask,
        click: () => {
          //updateMenu.reply('start-working', Number.parseInt(task.id));
          if (!state.persistedStates?.workingTask) {
            useRepo().updateWorkingTask({
              taskId: state.persistedStates.selectedTaskId,
              started: new Date(),
            });
          } else {
            clearInterval(interval);
            useRepo().updateWorkingTask(undefined);
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
            checked:
              (state.persistedStates?.selectedTaskId ? `${state.persistedStates?.selectedTaskId}` : undefined) ===
              task.id,
            type: 'radio',
            click(menuItem, browserWindow, event) {
              useRepo().updateSelectedTaskId(task.id ? Number(task.id) : undefined);
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
            checked:
              (state.persistedStates?.selectedProjectId ? `${state.persistedStates?.selectedProjectId}` : undefined) ===
              project.id,
            type: 'radio',
            click(menuItem, browserWindow, event) {
              useRepo().updateSelectedProjectId(project.id ? Number.parseInt(project.id) : undefined);
            },
          })) || [],
      },
      {
        label: 'Preferences',
        type: 'submenu',
        submenu: [
          {
            label: 'Show effort bar',
            type: 'checkbox',
            checked: state.preferences.effortBarIsVisible,
            click(menuItem, browserWindow, event) {
              useRepo().toggleEffortBarVisiblility();
            },
          },
        ],
      },
    ]);
    useTray().setContextMenu(contextMenu);
  });
};
