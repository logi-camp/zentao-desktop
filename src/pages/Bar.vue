<script lang="ts" setup>
import { DragOutlined, PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons-vue';

import useRepo from '../store/useRepo';
const repo = useRepo();
</script>
<template>
  <div class="bar" display="flex" flex="col" gap="0" text="sm" align="items-center">
    <div class="drag-region" text="lg">
      <DragOutlined />
    </div>
    <span>
      <button v-if="repo.amIworking_.value" @click="repo.stopTask()" text="xl"><PauseCircleOutlined /></button>
      <button v-else @click="repo.startTask()" text="xl"><PlayCircleOutlined /></button>
    </span>
    <div class="texts" display="flex" gap="1">
      <span v-if="repo.amIworking_.value"> {{ repo.workingSeconds_.value }}s </span>
      <span> #{{ repo.selectedTask_.value?.id }} </span>
      <span>
        {{ repo.selectedTask_.value?.name }}
      </span>
    </div>
  </div>
</template>
<style lang="sass" scoped>

.bar
  height: 100vh
  width: 100vw
  position: relative
  background: $background
  opacity: .4
  overflow: hidden
  border-radius: 5px 0 0 5px
  .drag-region
    opacity: .4
    -webkit-user-select: none !important
    -webkit-app-region: drag !important
    app-region: drag !important
    padding: 2px
    width: 24px
    height: 24px
    display: flex
    align-items: center
    justify-content: center
  span
    opacity: .5
    &:hover
      opacity: 1
  .texts
    writing-mode: vertical-rl
    text-orientation: revert
    display: flex
    flex-direction: row
    align-items: center
    justify-content: center
    font-size: 12px
    span
      white-space: nowrap !important
      text-overflow: ellipsis !important
      overflow: hidden !important
.bar:hover
    opacity: .9 !important
</style>
<style lang="sass">
#app
  height: 100vh
  overflow: hidden
  background: transparent
body
  overflow: hidden
</style>
