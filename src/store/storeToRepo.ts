import { select, Store } from '@ngneat/elf';
import { useObservable } from '@vueuse/rxjs';
import { debounceTime, filter, interval, map, withLatestFrom, merge, first } from 'rxjs';
import { Zentao12 } from '../api';
import { State } from './types';
import { ipcRenderer } from 'electron';
import { Project } from '../api/types';
import serialize from 'serialize-javascript';
import _ from 'lodash';
import { fuzzy_time } from '../utils';

function deserialize(serializedJavascript) {
  return eval('(' + serializedJavascript + ')');
}

export default (
  store: Store<
    {
      name: string;
      state: State;
      config: undefined;
    },
    State
  >
) => {
  class Repository {
    readonly state$ = store.pipe(select((state) => state));
    readonly tasks$ = store.pipe(select((state) => state.tasks));
    readonly projects$ = store.pipe(select((state) => state.projects));
    readonly selectedTaskId$ = store.pipe(select((state) => state.persistedStates.selectedTaskId));
    readonly selectedTask$ = store.pipe(
      select((state) => state.tasks.find((task) => task.id === `${state.persistedStates.selectedTaskId}`))
    );
    readonly selectedTask_ = useObservable(this.selectedTask$);

    readonly selectedProjectId$ = store.pipe(select((state) => state.persistedStates?.selectedProjectId));
    readonly selectedProjectId_ = useObservable(this.selectedProjectId$);

    readonly workingTask$ = store.pipe(select((state) => state.persistedStates?.workingTask));

    readonly amIWorking$ = store.pipe(select((state) => !!state.persistedStates?.workingTask?.started));
    readonly amIworking_ = useObservable(this.amIWorking$);

    readonly workingTask_ = useObservable(this.workingTask$);

    readonly menuState$ = store.pipe(select((state) => state));

    readonly selectedProjectTasks$ = store.pipe(
      select((state) => {
        if (state.persistedStates?.selectedProjectId) {
          return state.tasks?.filter((task) => {
            return Number.parseInt(task.project) == state.persistedStates?.selectedProjectId;
          });
        } else {
          return state.tasks;
        }
      })
    );

    readonly effortDetailDialogIsVisible$ = store.pipe(select((state) => state.effortDetailDialogIsVisible));
    openEffortDetailDialog() {
      store.update((state) => ({
        ...state,
        effortDetailDialogIsVisible: true,
      }));
    }
    closeEffortDetailDialog() {
      store.update((state) => ({
        ...state,
        effortDetailDialogIsVisible: false,
      }));
    }

    readonly effortDurationSeconds$ = interval(1000)
      .pipe(
        withLatestFrom(
          store.pipe(select((state) => state.persistedStates?.workingTask)).pipe(filter((state) => !!state?.started))
        )
      )
      .pipe(map(([, a]) => a))
      .pipe(
        select((workingTask) =>
          workingTask?.started ? Math.round((new Date().getTime() - workingTask?.started?.getTime()) / 1000) : undefined
        )
      );
    readonly effortDuration$ = this.effortDurationSeconds$.pipe(
      select((seconds) => {
        if (seconds) return fuzzy_time(seconds);
      })
    );

    readonly workingSeconds_ = useObservable(this.effortDurationSeconds$);

    readonly selectedProjectTasks_ = useObservable(this.selectedProjectTasks$);
    readonly selectedTaskId_ = useObservable(this.selectedTaskId$);

    readonly logs$ = store.pipe(select((state) => state.logs));
    readonly latestLog$ = store
      .pipe(select((state) => state.logs))
      .pipe(map((logs) => logs?.[logs?.length - 1]))
      .pipe(map((log) => ({ ...log, args: log?.args.map((item) => deserialize(item)) })));
    readonly latestLog_ = useObservable(this.latestLog$);

    async log(...args: any[]) {
      store.update((state) => ({
        ...state,
        logs: [...(state.logs || []), { date: new Date(), args: args.map((item) => serialize(item)) }],
      }));
    }

    async getTasks() {
      const result = await repo.zentao_.value?.getMyWorkTasks({});
      if (!result || result?.data?.locate) return;
      store.update((state) => ({
        ...state,
        tasks: result.data?.tasks,
      }));
    }

    async getProjects() {
      repo.updateProjects([]);
      const result = await repo.zentao_.value?.getMyProjects({});
      if (!result || result?.data?.locate) return;

      repo.updateProjects([
        ...(Object.values(result.data.projects) as Project[]),
        { name: 'All', id: undefined } as unknown as Project,
      ]);
    }

    test$ = store.pipe(select((state) => state.test));
    test2$ = store.pipe(select((state) => state.test2));
    addToTest() {
      store.update((state) => {
        return { ...state, test: (state.test || '') + '.' };
      });
    }

    startTask() {
      store.update((state) => {
        if (!state.persistedStates.selectedTaskId) {
          if (!ipcRenderer) {
            ipcRenderer.send('show-main-win', {});
          }
          return state;
        }
        return {
          ...state,
          persistedStates: {
            ...state.persistedStates,
            workingTask: { started: new Date(), taskId: state.persistedStates.selectedTaskId, seconds: 0 },
          },
        };
      });
    }

    stopTask() {
      this.openEffortDetailDialog();
    }

    updateSelectedTaskId(selectedTaskId: State['persistedStates']['selectedTaskId']) {
      store.update((state) => {
        if (state.persistedStates?.workingTask?.started) {
          return state;
        }
        return {
          ...state,
          persistedStates: { ...state.persistedStates, selectedTaskId },
        };
      });
    }

    effortBarIsVisible$ = store.pipe(select((state) => state.preferences.effortBarIsVisible));
    toggleEffortBarVisiblility() {
      store.update((state) => ({
        ...state,
        preferences: { ...state.preferences, effortBarIsVisible: !state.preferences.effortBarIsVisible },
      }));
    }

    deselectTask() {
      store.update((state) => {
        if (state.persistedStates?.workingTask?.started) {
          return state;
        }
        return {
          ...state,
          persistedStates: { ...state.persistedStates, selectedTaskId: undefined },
        };
      });
    }

    updateProjects(projects: State['projects']) {
      store.update((state) => ({
        ...state,
        projects,
      }));
    }

    updateSelectedProjectId(selectedProjectId: State['persistedStates']['selectedProjectId']) {
      store.update((state) => ({
        ...state,
        persistedStates: { ...state.persistedStates, selectedProjectId },
      }));
    }

    async submitEffort(wt: Partial<State['persistedStates']['workingTask']>) {
      const workingTask = store.query((state) => state.persistedStates.workingTask);
      Object.entries(wt).forEach(([k, v]) => {
        workingTask[k] = v;
      });
      try {
        this.log('workingTask', workingTask);
        const result = await this.zentao_.value?.addEfforts({
          taskId: `${workingTask.taskId}`,
          data: [
            {
              dates: (await import('dateformat')).default(new Date(), 'yyyy-mm-dd'),
              id: '0',
              work: workingTask.work,
              consumed: `${this.workingSeconds_.value / 3600}`,
              left: `${workingTask.left}`,
            },
          ],
        });
        this.log('workingTask', workingTask, result);
        store.update((state) => {
          return {
            ...state,
            persistedStates: { ...state.persistedStates, workingTask: undefined },
          };
        });
        this.closeEffortDetailDialog();
      } catch (e) {
        this.log('catch', e);
      }
      /* store.update((state) => {
        const workingTask = state.persistedStates.workingTask;
        Object.entries(wt).forEach(([k, v]) => {
          workingTask[k] = v;
        });

        return {
          ...state,
          persistedStates: { ...state.persistedStates, workingTask },
        };
      }); */
    }

    saveApiUrl(apiUrl: string) {
      store.update((state) => ({
        ...state,
        preferences: { ...state.preferences, apiUrl },
      }));
    }

    customHeaders$ = store.pipe(select((state) => state?.preferences?.customHeaders));
    customHeaders_ = useObservable(this.customHeaders$);
    updateCustomHeaders(headers: Record<string, string>) {
      store.update((state) => ({
        ...state,
        preferences: { ...state.preferences, customHeaders: headers },
      }));
    }

    apiUrl$ = store.pipe(select((state) => state.preferences.apiUrl)).pipe(filter((v) => !!v));
    apiUrl_ = useObservable(this.apiUrl$);

    useZentao() {}

    zentao$ = store
      .pipe(select((state) => state.preferences.apiUrl))
      .pipe(filter((url) => !!url))
      .pipe(
        map((url) => {
          const zentao = new Zentao12({ url });
          zentao.fetchConfig();
          return zentao;
        })
      );
    zentao_ = useObservable(this.zentao$);
  }

  const repo = new Repository();

  repo.customHeaders$.pipe(debounceTime(100)).subscribe((headers) => {
    if (!headers?.['Cookie']) {
      if (!store.query((state) => state.logingIn)) {
        store.update((state) => ({ ...state, logingIn: true }));
        ipcRenderer?.send('open-login-window', 'ping');
      }
    } else {
      store.update((state) => ({ ...state, logingIn: false }));
    }
  });

  return repo;
};
