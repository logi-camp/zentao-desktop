<template>
  <li
    @click="
      repo.selectedTaskId_.value && `${repo.selectedTaskId_.value}` === task.id
        ? repo.deselectTask()
        : repo.updateSelectedTaskId(task.id ? Number.parseInt(task.id) : undefined)
    "
    :class="{ selected }"
  >
    <div class="progress" :style="`width: ${task.progress}%;`"></div>
    <div display="flex" gap="1" align="items-center" z="1" p="x-2 y-1" pos="relative">
      <span text="sm gray-200" class="abbr" p="x-1 y-0">#{{ task.id }}</span>
      <span>{{ task.name }}</span>
      <span class="chips" text="12px" :class="task.status" display="inline-block" :bg="task.status">
        {{ task.status }}
      </span>
      <span>
        {{ state.effortResult?.efforts.length }}
      </span>
    </div>
  </li>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { Zentao12 } from '../api';
import { Task, EffortListData } from '../api/types';
import useRepo from '../store/useRepo';

const repo = useRepo();

const props = defineProps<{ task: Task; selected?: boolean }>();

useRepo()
  .zentao_.value?.getEffortList({ taskId: props.task.id })
  .then((result) => {
    state.effortResult = result.data;
  });

const state = reactive<{
  effortResult?: EffortListData;
}>({});

defineEmits<{ (e: 'select'): void }>();
</script>
<style lang="sass" scoped>
.done
    background: $success
    color: $black
.doing
    background: $accent
    color: $black
.waiting
    background: $secondary

li
    .abbr
        border-radius: 1.5px
    &.selected .abbr
        background-color: $primary
    position: relative
    cursor: pointer
    .progress
        position: absolute
        height: 100%
        background: rgba($accent, 0.2)
        top: 0
        left: 0
        z-index: 0
</style>
