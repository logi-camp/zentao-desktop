import { select, Store } from '@ngneat/elf';
import { useObservable } from '@vueuse/rxjs';
import { debounceTime, filter, interval, map, throttle, withLatestFrom, defaultIfEmpty } from 'rxjs';
import { Zentao12 } from '../api';
import { State } from './types';
import { ipcRenderer } from 'electron';
import { Project } from '../api/types';
import serialize from 'serialize-javascript';
import _ from 'lodash';

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
    readonly selectedTaskId$ = store.pipe(select((state) => state.selectedTaskId));
    readonly selectedTask$ = store.pipe(
      select((state) => state.tasks.find((task) => task.id === `${state.selectedTaskId}`))
    );
    readonly selectedTask_ = useObservable(this.selectedTask$);

    readonly selectedProjectId$ = store.pipe(select((state) => state.selectedProjectId));
    readonly selectedProjectId_ = useObservable(this.selectedProjectId$);

    readonly workingTask$ = store.pipe(select((state) => state.workingTask));

    readonly amIWorking$ = store.pipe(select((state) => !!state.workingTask?.started));
    readonly amIworking_ = useObservable(this.amIWorking$);

    readonly workingTask_ = useObservable(this.workingTask$);

    readonly menuState$ = store.pipe(select((state) => state));

    readonly selectedProjectTasks$ = store.pipe(
      select((state) => {
        if (state.selectedProjectId) {
          return state.tasks?.filter((task) => {
            return Number.parseInt(task.project) == state.selectedProjectId;
          });
        } else {
          return state.tasks;
        }
      })
    );

    readonly workingSeconds$ = interval(1000)
      .pipe(withLatestFrom(store.pipe(select((state) => state.workingTask)).pipe(filter((state) => !!state?.started))))
      .pipe(map(([, a]) => a))
      .pipe(
        select((workingTask) =>
          workingTask?.started ? Math.round((new Date().getTime() - workingTask?.started?.getTime()) / 1000) : undefined
        )
      );

    readonly workingSeconds_ = useObservable(this.workingSeconds$);

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
      console.log('tasks', result.data);
      store.update((state) => ({
        ...state,
        tasks: result.data?.tasks,
      }));
    }

    async getProjects() {
      repo.updateProjects([]);
      const result = await repo.zentao_.value?.getMyProjects({});
      if (!result || result?.data?.locate) return;

      console.log('res', result.data);
      repo.updateProjects([
        ...(Object.values(result.data.projects) as Project[]),
        { name: 'All', id: undefined } as unknown as Project,
      ]);
    }

    startTask() {
      store.update((state) => {
        if (!state.selectedTaskId) return state;
        return {
          ...state,
          workingTask: { started: new Date(), taskId: state.selectedTaskId, seconds: 0 },
        };
      });
    }

    async stopTask() {
      this.log({ s: 'stopTask' });
      try {
        const result = await this.zentao_.value?.addEfforts({
          taskId: `${this.workingTask_.value.taskId}`,
          data: [
            {
              dates: (await import('dateformat')).default(new Date(), 'yyyy-mm-dd'),
              id: '0',
              work: 'Test Desktop App',
              consumed: `${this.workingSeconds_.value / 3600}`,
              left: '1',
            },
          ],
        });
      } catch (e) {
        console.log('stopTaskError', e);
      }
      store.update((state) => {
        return {
          ...state,
          workingTask: undefined,
        };
      });
    }

    updateSelectedTaskId(selectedTaskId: State['selectedTaskId']) {
      store.update((state) => {
        if (state.workingTask?.started) {
          return state;
        }
        return {
          ...state,
          selectedTaskId,
        };
      });
    }

    deselectTask() {
      store.update((state) => {
        if (state.workingTask?.started) {
          return state;
        }
        return {
          ...state,
          selectedTaskId: undefined,
        };
      });
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

    saveApiUrl(apiUrl: string) {
      store.update((state) => ({
        ...state,
        apiUrl,
      }));
    }

    customHeaders$ = store.pipe(select((state) => state.customHeaders));
    customHeaders_ = useObservable(this.customHeaders$);
    updateCustomHeaders(headers: Record<string, string>) {
      store.update((state) => ({
        ...state,
        customHeaders: headers,
      }));
    }

    apiUrl_ = useObservable(store.pipe(select((state) => state.apiUrl)));

    useZentao() {}

    zentao$ = store
      .pipe(select((state) => state.apiUrl))
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

  repo.customHeaders$
  .pipe(debounceTime(100))
    .subscribe((headers) => {
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
