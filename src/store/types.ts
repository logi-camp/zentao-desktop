import { Project, Task } from '../api/types';

export type State = {
  readonly projects: Project[];
  readonly selectedProjectId?: number;
  readonly tasks: Task[];
  readonly selectedTaskId?: number;
  readonly workingTask?: {
    taskId: number;
    started: Date;
  };
};
