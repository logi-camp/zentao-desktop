import { Project, Task } from '../api/types';

export type State = {
  projects: Project[];
  tasks: Task[];
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
    };
  },
  preferences: {
    apiUrl?: string;
    customHeaders: Record<string, string>;
    effortBarIsVisible: boolean;
  };
  test: string;
  test2: string;
};
