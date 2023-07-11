<template>
  <li @click="openKanban(kanban.id)">{{ kanban.name }}</li>
</template>
<script lang="ts" setup>
import { ipcRenderer } from 'electron';
import { Exectution } from '../api/types';

defineProps<{ kanban: Exectution; selected: boolean }>();

const openKanban = (id: string) => {
  ipcRenderer.send('open-kanban-window', id);
};
</script>
<style lang="sass">
li
  cursor: pointer
  padding: 3px
</style>
