import { Menu } from 'electron';
import useRepo from './store/useRepo';
import useTray from './useTray';
import { combineLatest, defaultIfEmpty, startWith, throttleTime, zip } from 'rxjs';
import { Project, Task } from '../../src/api/types';

let contextMenu: Electron.Menu;

const loadTrayMenu = (
  app: Electron.App,
  amIWorking: boolean,
  projects: Project[],
  tasks: Task[],
  selectedProjectId: number,
  selectedTaskId: number,
  effortBarIsVisible: boolean,
  duration: string
) => {
  contextMenu = Menu.buildFromTemplate([
    {
      label: amIWorking ? `Click to stop working ${duration}` : 'Click to start working',
      type: 'checkbox',
      checked: amIWorking,
      click: () => {
        if (useRepo().amIworking_.value) {
          useRepo().stopTask();
        } else {
          useRepo().startTask();
        }
      },
    },
    {
      label: 'Task',
      type: 'submenu',
      submenu:
        tasks?.map((task) => ({
          id: 'task-' + task.id,
          label: task.name,
          checked: (selectedTaskId ? `${selectedTaskId}` : undefined) === task.id,
          type: 'radio',
          click() {
            useRepo().updateSelectedTaskId(task.id ? Number(task.id) : undefined);
          },
        })) || [],
    },
    {
      label: 'Project',
      type: 'submenu',
      submenu:
        projects?.map((project) => ({
          id: project.id,
          label: project.name,
          checked: (selectedProjectId ? `${selectedProjectId}` : undefined) === project.id,
          type: 'radio',
          click() {
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
          checked: effortBarIsVisible,
          click() {
            useRepo().toggleEffortBarVisiblility();
          },
        },
      ],
    },
    {
      label: 'Quit',
      type: 'normal',
      click() {
        app.quit();
      },
    },
  ]);
};

export default async (app: Electron.App, openMainWindow: () => void) => {
  combineLatest([
    useRepo().amIWorking$.pipe(startWith(false)),
    useRepo().projects$.pipe(startWith([])),
    useRepo().selectedProjectTasks$.pipe(startWith([])),
    useRepo().selectedTaskId$.pipe(startWith(undefined)),
    useRepo().selectedProjectId$.pipe(startWith(undefined)),
    useRepo().effortBarIsVisible$.pipe(startWith(true)),
    useRepo().effortDuration$.pipe(startWith(undefined)).pipe(throttleTime(10000)),
  ]).subscribe(([amIWorking, projects, tasks, selectedTaskId, selectedProjectId, effortBarIsVisible, duration]) => {
    loadTrayMenu(app, amIWorking, projects, tasks, selectedTaskId, selectedProjectId, effortBarIsVisible, duration);
    useTray(openMainWindow).setContextMenu(contextMenu);
  });
};
