<script lang="ts" setup>
import { reactive } from 'vue';
import useRepo from '../store/useRepo';
const win = window;
document.title = 'Working Task Detail';
const state = reactive<{ work?: string; left?: number }>({});
</script>
<template>
  <div>
    <input type="text" placeholder="Some effort" v-model="state.work" />
    <input type="number" v-model="state.left" placeholder="2" />
    <button
      @click="
        () => {
          useRepo().updateWorkingTask({ ...(useRepo().workingTask_.value || {}), work: state.work, left: state.left });
          win.close();
        }
      "
    >
      Submit
    </button>
  </div>
</template>
