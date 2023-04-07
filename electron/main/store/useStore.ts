import levelup from 'levelup';
import leveldown from 'leveldown';
import serialize from 'serialize-javascript';
import _ from 'lodash';
import { State } from '../../../src/store/types';
import { createStore, Store, withProps } from '@ngneat/elf';
import { app, ipcMain } from 'electron';
import { persistState } from '@ngneat/elf-persist-state';
import initialState from '../../../src/store/initialState';
import useRepo from './useRepo';
import { map } from 'rxjs';

function deserialize(serializedJavascript: string) {
  return eval('(' + serializedJavascript + ')');
}

let store: Store<
  {
    name: string;
    state: State;
    config: undefined;
  },
  State
>;

export default () => {
  if (!store) {
    var db = levelup(leveldown(app.getPath('userData') + '/store-db'));

    store = createStore({ name: 'store' }, withProps<State>(initialState));

    ipcMain.on('subscribe-main-store-change', (event) => {
      store.subscribe((state) => {
        event.reply('main-store-changed', state);
      });
    });

    persistState(store, {
      key: 'store',
      source: () =>
        store.pipe(map((state) => ({ preferences: state.preferences, persistedStates: state.persistedStates }))),
      runGuard: () => true,
      storage: {
        setItem: async (key: string, value: any) => {
          try {
            return await db.put(key, serialize(value));
          } catch (e) {
            console.error(e);
          }
        },
        getItem: async <T>(key: string) => {
          try {
            return (await deserialize((await db.get(key)).toString())) as any as T;
          } catch (e) {
            console.error(e);
            return initialState as T;
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

    ipcMain.on('set-store', (event, value: State) => {
      if (!_.isEqual(store.getValue(), value)) {
        store.update((state) => value);
      }
    });

    ipcMain.on('get-store', (event) => {
      useRepo().state$.subscribe((val) => {
        event.reply('get-store-response', val);
      });
      event.reply('get-store-response', store.getValue());
    });

    ipcMain.on('remove-store', (event, value: State) => {
      store.update((state) => initialState);
    });
  }

  return store;
};
