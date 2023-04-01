import { select, Store } from '@ngneat/elf';
import { useObservable } from '@vueuse/rxjs';
import { State } from './types';

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
    readonly selectedProjectTasks_ = useObservable(this.selectedProjectTasks$);
    readonly selectedTaskId_ = useObservable(this.selectedTaskId$);

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
  return new Repository();
};
