<template>
  <li
    p="3"
    :class="{ selected: project.id === (selected ? `${selected}` : undefined) }"
    cursor="pointer"
    @click="$emit('update:selected', Number.parseInt(project.id))"
    border="white"
  >
    <div class="progress" :style="`width: ${project.progress}%;`"></div>
    <div z="1" align="items-center" display="flex" pos="relative">
      <div display="flex" flex="col" v-if="project.id" class="abbr">
        <span text="sm gray-200" leading="4">#{{ project.id }}</span>
        <span :class="project.status" class="chips" text="12px">{{ project.status }}</span>
      </div>
      <span text="lg" leading="5" p="x-3">
        {{ project.name }}
      </span>
    </div>
  </li>
</template>
<script lang="ts" setup>
import { Project } from '../zentao-api/src/types';

const props = defineProps<{ project: Project; selected?: number }>();
defineEmits<{ (e: 'update:selected'): void }>();
console.log('oroj', props.project);
</script>
<style lang="sass" scoped>
.done
    background: $primary
.doing
    background: $success
.waiting
    background: $secondary
li
  box-sizing: content-box
  .abbr
    position: relative
    padding: 2px
    border-radius: 2px
  &.selected
    .abbr
      background: $primary
  position: relative
  .progress
    position: absolute
    height: 100%
    background: rgba($accent, 0.2)
    top: 0
    left: 0
    z-index: 0 !important
</style>
