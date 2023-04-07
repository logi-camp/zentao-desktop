<script lang="ts" setup>
import { ipcRenderer } from 'electron';
import { reactive } from 'vue';
//import useRepo from '../store/useRepo';
//const win = window;
document.title = 'Effort Detail';
const finish = () => {
  //const workingTask = useRepo().workingTask_.value;
  //if ((workingTask && workingTask?.seconds, workingTask?.taskId, workingTask?.started)){

  /* useRepo().updateWorkingTask({
      ...workingTask,
      work: state.work,
      left: state.left,
      taskId: 0,
    }); */
  ipcRenderer.send('dialog-submit', JSON.parse(JSON.stringify(state)));
};

const state = reactive<{ work?: string; left?: number }>({});
</script>
<template>
  <div display="flex" flex="col" gap="2" m="6">
    <div>
      work:
      <input type="text" placeholder="Some work" p="x-1" v-model="state.work" />
    </div>
    <div display="flex" gap="1"><span></span>left: <input type="number" v-model="state.left" p="x-1" placeholder="2" /> hour</div>
    <button @click="finish()" border="1px solid var(--foreground)">Submit</button>
  </div>
</template>
