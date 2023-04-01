import storeToRepo from '../../../src/store/storeToRepo';
import useStore from './useStore';

let repo: ReturnType<typeof storeToRepo>;

export default () => {
  if (!repo) {
    repo = storeToRepo(useStore());
  }
  return repo;
};
