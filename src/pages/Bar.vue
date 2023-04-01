<script lang="ts" setup>
import { CaretRightFilled } from '@ant-design/icons-vue';

import { useObservable } from '@vueuse/rxjs';
import useRepo from '../store/useRepo';
const repository = useRepo();
const currentTask = useObservable(repository.selectedTaskId$);
</script>
<template>
  <div display="flex" gap="2" text="sm" align="items-center">
    <span>
      <button text="xl"><CaretRightFilled /></button>
    </span>
    <span> #{{ repository.selectedTask_.value?.id }} </span>
    <span>
      {{ repository.selectedTask_.value?.name }}
    </span>
  </div>
</template>
<style lang="sass" scoped>
div
  height: 100vh
  width: 100%
  position: relative
  -webkit-user-select: none
  -webkit-app-region: drag
  app-region: drag
</style>
<style lang="sass">
#app
  height: 100vh
  overflow: hidden
</style>
