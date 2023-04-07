<script lang="ts" setup>
import { DragOutlined, PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons-vue';
import { ipcRenderer } from 'electron';
import { computed } from 'vue';
import useRepo from '../store/useRepo';
import storeToRepo from '../store/storeToRepo';

function fuzzy_time(dif: number) {
  let res = '';

  const t_second = 1;
  const t_minute = t_second * 60;
  const t_hour = t_minute * 60;
  const t_day = t_hour * 24;
  const t_month = Math.floor(t_day * 30.4);
  const t_year = t_month * 12;

  const fuzzy_string = (time_ref: number, time_str: string, max?: number) => {
    const fuzzy = max ? Math.floor(dif / time_ref) % max : Math.floor(dif / time_ref);
    if (res) {
      res += ' ';
    }
    res += fuzzy + ' ' + time_str;
    if (fuzzy != 1) {
      res += 's';
    }
  };

  if (dif >= t_year) fuzzy_string(t_year, 'year');
  if (dif >= t_month) fuzzy_string(t_month, 'month', 12);
  if (dif >= t_day) fuzzy_string(t_day, 'day', 30);
  if (dif >= t_hour) fuzzy_string(t_hour, 'hour', 24);
  if (dif >= t_minute) fuzzy_string(t_minute, 'minute', 60);
  if (dif >= t_second) fuzzy_string(t_second, 'second', 60);
  else res = 'now';

  return res;
}

const duration = computed(() => {
  if (repo.workingSeconds_.value) return fuzzy_time(repo.workingSeconds_.value);
});

const showMainWindow = () => {
  ipcRenderer.send('show-main-win', {});
};

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
    <div class="texts" display="flex" gap="1" @click="showMainWindow()">
      <span v-if="repo.amIworking_.value">{{ duration }} </span>
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
  border-radius: 5px
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
