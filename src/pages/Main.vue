<script setup lang="ts">
import { reactive } from 'vue';
import { ipcRenderer } from 'electron';
import TaskCMP from './Task.vue';
import ProjectCMP from './Project.vue';
import { useObservable } from '@vueuse/rxjs';
import useRepo from '../store/useRepo';

const repo = useRepo();

const load = () => {
  repo.getTasks();
  repo.getProjects();
};

load();

const openNativePage = () => {
  ipcRenderer.send('open-native-page-window', 'ok');
};

const state = reactive<{ url?: string }>({});

const projects = useObservable(repo.projects$);
const tasks = useObservable(repo.selectedProjectTasks$);
</script>

<template>
  <div h="full" class="main" v-if="repo.apiUrl_.value">
    <div class="header" display="flex" p="2" bg="$foreground" gap="1">
      <button w="full" @click="openNativePage" bg="$background">Native Page</button>
      <button w="full" class="w-full" @click="load()" bg="$background">Reload</button>
    </div>
    <div display="flex" align="items-stretch" w="full" flex="wrap">
      <ul w="[30%]">
        <ProjectCMP v-for="project in projects" :project="project" v-model:selected="repo.selectedProjectId_.value" />
      </ul>
      <div h="100%" border="right-[1px] dashed var(--primary)"></div>
      <ul flex="1">
        <TaskCMP v-for="task in tasks" :task="task" :selected="`${repo.selectedTaskId_.value}` === task.id" />
      </ul>
      <div h="100%" border="right-[1px] dashed var(--primary)"></div>
    </div>
  </div>
  <div v-else class="enter-url">
    <hr />
    <div display="flex" flex="col" p="6" gap="3" text="center">
      <h4>Enter the Zentao URL</h4>
      <span display="flex" gap="2">
        URL:
        <input v-model="state.url" flex="1" type="url" placeholder="https://zentao.example.com" />
      </span>
      <button
        border="1px var(--primary)"
        @click="
          () => {
            state.url && repo.saveApiUrl(state.url);
            load();
          }
        "
      >
        Save
      </button>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.main
  background: $background
.enter-url
  button
    border: 1px solid $primary
</style>
