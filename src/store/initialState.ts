import { State } from './types';

const initialState: State = {
  projects: [],
  tasks: [],
  persistedStates: {},
  preferences: { customHeaders: {}, effortBarIsVisible: true },
};

export default initialState;
