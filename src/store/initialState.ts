import { State } from './types';

const initialState: State = {
  projects: [],
  tasks: [],
  persistedStates: {},
  preferences: { customHeaders: {}, showWorkingTaskBar: true },
};

export default initialState;
