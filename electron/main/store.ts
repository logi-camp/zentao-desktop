import { createStore, withProps, select } from '@ngneat/elf';
import { persistState, localStorageStrategy, StateStorage, sessionStorageStrategy } from '@ngneat/elf-persist-state';
import { Project, Task } from '../../src/api/types';
import { app, ipcMain } from 'electron';
import levelup from 'levelup';
import leveldown from 'leveldown';
import serialize from 'serialize-javascript';
function deserialize(serializedJavascript) {
  return eval('(' + serializedJavascript + ')');
}

console.log('userData', app.getPath('appData'), app.getAppPath());
// 1) Create our store
var db = levelup(leveldown(app.getPath('userData') + '/store-db'));

type State = {
  readonly projects: Project[];
  readonly selectedProjectId?: number;
  readonly tasks: Task[];
  readonly selectedTaskId?: number;
  readonly workingTask?: {
    taskId: number;
    started: Date;
  };
};

const initialState: State = { projects: [], tasks: [] };

export const store = createStore({ name: 'store' }, withProps<State>(initialState));

export const persist = persistState(store, {
  key: 'store',
  runGuard: () => true,
  storage: {
    setItem: async (key: string, value: any) => {
      try {
        return await db.put(key, serialize(value));
      } catch (e) {
        console.log(e);
      }
    },
    getItem: async <State>(key: string) => {
      try {
        return (await deserialize((await db.get(key)).toString())) as any as State;
      } catch (e) {
        console.error(e);
        return initialState;
      }
    },
    removeItem: async (key: string) => {
      try {
        return await db.del(key);
      } catch {
        return false;
      }
    },
  },
  // storage: sessionStorageStrategy,
  /* storage: {
    getItem: async <T extends Record<string, any>>(key: string) => {
      const res = electronStore.get(key) as T;
      return res;
    },
    setItem: async (key: string, value: any) => {
      if (value?.workingTask?.interval) {
        value.workingTask.interval = undefined;
      }
      electronStore.set(key, value);
      return true;
    },
    removeItem: async (key: string) => {
      electronStore.delete(key);
      return true;
    },
  }, */
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

/* ipcMain.on('set-store', (event, value: State) => {
  console.log('set-store', value);
  store.update((state) => value);
});

ipcMain.on('get-store', (event) => {
  event.reply(store.getValue());
});

ipcMain.on('remove-store', (event, value: State) => {
  store.update((state) => initialState);
}); */

export const repository = new Repository();
