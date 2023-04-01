<template>
  <li @click="repository.updateSelectedTaskId(task.id ? Number.parseInt(task.id) : undefined)" :class="{ selected }">
    <div class="progress" :style="`width: ${task.progress}%;`"></div>
    <div display="flex" gap="1" align="items-center" z="1" p="x-2 y-1" pos="relative">
      <span text="sm gray-200" class="abbr" p="x-1 y-0">#{{ task.id }}</span>
      <span>{{ task.name }}</span>
      <span>{{ task.project }}</span>
      <span class="chips" text="12px" :class="task.status" display="inline-block" :bg="task.status">
        {{ task.status }}
      </span>
    </div>
  </li>
</template>
<script lang="ts" setup>
import { Task } from '../api/types';
import useRepo from '../store/useRepo';

const repository = useRepo();

defineProps<{ task: Task; selected?: boolean }>();
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
