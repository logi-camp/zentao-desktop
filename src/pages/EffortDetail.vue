<script lang="ts" setup>
import { ipcRenderer } from 'electron';
import { reactive } from 'vue';
import useRepo from '../store/useRepo';
import { useObservable } from '@vueuse/rxjs';

document.title = 'Effort Detail';
const finish = () => {
  useRepo().submitEffort({
    left: state.left,
    work: state.work
  });
};

const effortDuration = useObservable(useRepo().effortDuration$);

const state = reactive<{ work?: string; left?: number }>({});
</script>
<template>
  <div display="grid" flex="col" gap="2" m="6">
    <div display="flex" gap="1"><span>Task:</span> {{ useObservable(useRepo().selectedTask$).value?.name }}</div>
    <div display="flex" gap="1"><span>Duration:</span> {{ effortDuration }}</div>
    <div display="flex" gap="1">
      <span>work:</span>
      <input type="text" placeholder="Some work" p="x-1" v-model="state.work" />
    </div>
    <div display="flex" gap="1">
      <span>left: </span><input type="number" v-model="state.left" p="x-1" placeholder="2" /> hour
    </div>
    <button @click="finish()" border="1px solid var(--foreground)">Submit</button>
  </div>
</template>
<style lang="sass" scoped>
div > span
  width: 90px
</style>
