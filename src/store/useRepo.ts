import storeToRepo from './storeToRepo';
import useStore from './useStore';

let repo: ReturnType<typeof storeToRepo>;

export default () => {
  if (!repo) {
    repo = storeToRepo(useStore());
  }
  return repo;
};
