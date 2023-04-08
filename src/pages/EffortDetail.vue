<script lang="ts" setup>
import { ipcRenderer } from 'electron';
import { reactive } from 'vue';
import useRepo from '../store/useRepo';
import { useObservable } from '@vueuse/rxjs';

document.title = 'Effort Detail';
const submit = () => {
  useRepo().submitEffort({
    left: state.left,
    work: state.work,
  });
};

const effortDuration = useObservable(useRepo().effortDuration$);

const state = reactive<{ work?: string; left?: number }>({});
</script>
<template>
  <div display="flex" flex="col" gap="2" m="6">
    <div display="flex" gap="1">
      <span>Task:</span>
      <div flex="1">{{ useObservable(useRepo().selectedTask$).value?.name }}</div>
    </div>
    <div display="flex">
      <span>Duration:</span>
      <div flex="1">{{ effortDuration }}</div>
    </div>
    <div display="flex">
      <span>work:</span>
      <div flex="1">
        <input size="4" maxlength="4" w="full" type="text" placeholder="Some work" p="x-1" v-model="state.work" />
      </div>
    </div>
    <div display="flex">
      <span>left: </span>
      <div flex="1" display="flex" gap="1">
        <input size="4" maxlength="4" flex="1" type="number" v-model="state.left" p="x-1" placeholder="2" /><div> hour</div>
      </div>
    </div>
    <div display="flex" gap="1" justify="items-stretch">
      <button flex="1" @click="submit()" border="1px solid var(--foreground)">Submit</button>
      <button flex="1" @click="useRepo().cancelEffort()" border="1px solid var(--foreground)">Cancel</button>
    </div>
  </div>
</template>
<style lang="sass" scoped>
div > span
  width: 90px
input
  max-width: 100% !important
  width: 100% !important
  display: block
</style>
