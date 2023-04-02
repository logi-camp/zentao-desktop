import { createStore, Store, withProps } from '@ngneat/elf';
import { persistState } from '@ngneat/elf-persist-state';
import { ipcRenderer } from 'electron';
import _ from 'lodash';
import { debounceTime } from 'rxjs';
import { State } from './types';

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
    store = createStore({ name: 'store' }, withProps<State>({ projects: [], tasks: [] }));
    ipcRenderer.on('get-store-response', (event, val: State) => {
      if (!_.isEqual(val, store.getValue())) {
        store.update((state) => val);
      }
    });
    persistState(store, {
      key: 'store',
      runGuard: () => true,
      source: () => store.pipe(debounceTime(100)),
      storage: {
        getItem: async <State>(key: string) => {
          ipcRenderer.send('get-store');
          return await new Promise<State>((resolve) =>
            ipcRenderer.once('get-store-response', (event, val: State) => {
              resolve(val);
            })
          );
        },
        setItem: async (key: string, value: State) => {
          ipcRenderer.send('set-store', value);
          return true;
        },
        removeItem: async (key: string) => {
          ipcRenderer.send('remove-store');
          return true;
        },
      },
    });
  }
  return store;
};
