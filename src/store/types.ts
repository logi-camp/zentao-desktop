import { Project, Task } from '../api/types';

export type State = {
  projects: Project[];
  selectedProjectId?: number;
  tasks: Task[];
  selectedTaskId?: number;
  workingTask?: {
    taskId: number;
    started: Date;
    seconds: number;
  };
  showWorkingTaskBar: boolean;
  apiUrl?: string;
  logs: {args: any[], date: Date }[]
  customHeaders: Record<string,string>;
  logingIn: boolean;
};
