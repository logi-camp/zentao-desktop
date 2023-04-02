import storeToRepo from '../../../src/store/storeToRepo';
import useStore from './useStore';

let repo: ReturnType<typeof storeToRepo>;

export default () => {
  if (!repo) {
    repo = storeToRepo(useStore());

    repo.latestLog$.subscribe((log) => {
      console.log(log?.date?.toISOString(), ...(log?.args || []));
    });
  }
  return repo;
};
