import { createStore, withProps, select } from '@ngneat/elf';
import { persistState, localStorageStrategy, StateStorage, sessionStorageStrategy } from '@ngneat/elf-persist-state';
import { Project, Task } from '../zentao-api/src/types';
import ElectronStore from 'electron-store';
import { isTemplateNode } from '@vue/compiler-core';

const electronStore = new ElectronStore({
  name: 'main',
});

type State = {
  readonly projects: Project[];
  readonly selectedProjectId?: number;
  readonly tasks: Task[];
  readonly selectedTaskId?: number;
  readonly workingTask?: {
    taskId: number;
    started: Date;
    interval: NodeJS.Timer;
  };
};

export const store = createStore({ name: 'store' }, withProps<State>({ projects: [], tasks: [] }));

export const persist = persistState(store, {
  key: 'store',
  runGuard: () => true,
  storage: {
    getItem: async <T extends Record<string, any>>(key: string) => {
      const res = electronStore.get(key) as T;
      return res;
    },
    setItem: async (key: string, value: any) => {
      if(value?.workingTask?.interval){
        value.workingTask.interval = undefined;
      }
      electronStore.set(key, value);
      return true;
    },
    removeItem: async (key: string) => {
      electronStore.delete(key);
      return true;
    },
  },
});

export class Repository {
  readonly tasks$ = store.pipe(select((state) => state.tasks));
  readonly projects$ = store.pipe(select((state) => state.projects));
  readonly selectedTaskId$ = store.pipe(select((state) => state.selectedTaskId));
  readonly selectedProjectId$ = store.pipe(select((state) => state.selectedProjectId));
  readonly workingTask$ = store.pipe(select((state) => state.workingTask));
  readonly menuState$ = store.pipe(select((state) => state));

  updateTasks(tasks: State['tasks']) {
    store.update((state) => ({
      ...state,
      tasks,
    }));
  }

  updateSelectedTaskId(selectedTaskId: State['selectedTaskId']) {
    store.update((state) => ({
      ...state,
      selectedTaskId,
    }));
  }

  updateProjects(projects: State['projects']) {
    store.update((state) => ({
      ...state,
      projects,
    }));
  }

  updateSelectedProjectId(selectedProjectId: State['selectedProjectId']) {
    store.update((state) => ({
      ...state,
      selectedProjectId,
    }));
  }

  updateWorkingTask(workingTask: State['workingTask']) {
    store.update((state) => ({
      ...state,
      workingTask,
    }));
  }
}

export const repository = new Repository();
