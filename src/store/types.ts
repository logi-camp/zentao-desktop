import { Exectution, Project, Task } from '../api/types';

export type State = {
  projects: Project[];
  tasks: Task[];
  executions: Exectution[];
  logs: { args: any[]; date: Date }[];
  logingIn: boolean;
  effortDetailDialogIsVisible?: boolean;
  persistedStates: {
    selectedProjectId?: number;
    selectedTaskId?: number;
    workingTask?: {
      taskId: number;
      started: Date;
      work?: string;
      left?: number;
      consumed?: number;
    };
  };
  preferences: {
    apiUrl?: string;
    customHeaders: Record<string, string>;
    effortBarIsVisible: boolean;
  };
  test: string;
  test2: string;
};
