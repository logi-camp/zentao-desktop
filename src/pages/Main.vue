<script setup lang="ts">
import { Zentao12 } from '../../src/api';
import { Project, Task } from '../../src/api/types';
import { computed, reactive, watch } from 'vue';
import { ipcRenderer } from 'electron';
import TaskCMP from './Task.vue';
import ProjectCMP from './Project.vue';
import { useObservable } from '@vueuse/rxjs';
import useRepo from '../store/useRepo';

const repository = useRepo();

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg); // prints "pong"
});

const zentao = new Zentao12({ url: 'https://zentao.logicamp.top', account: 'mohamad', password: 'thu6xeiR' });

const getTasks = async () => {
  const result = await zentao.getMyWorkTasks({});
  if (result.data?.locate) {
    ipcRenderer.send('open-login-window', 'ping');
  } else {
    console.log('tasks', result.data);
    repository.updateTasks(result.data?.tasks);
  }
  console.log('tasks', result);
};

const init = async () => {
  await zentao.fetchConfig();
  const result = await zentao.getMyProjects({});
  if (result.data?.locate) {
    ipcRenderer.send('open-login-window', 'ping');
  } else {
    console.log('res', result.data);
    repository.updateProjects([
      ...(Object.values(result.data.projects) as Project[]),
      { name: 'All', id: undefined } as unknown as Project,
    ]);
  }

  await getTasks();
};

init();

const openNativePage = () => {
  ipcRenderer.send('open-native-page-window', 'ok');
};

const projects = useObservable(repository.projects$);
</script>

<template>
  <div h="full">
    <div class="header" display="flex" p="2" bg="$foreground" gap="1">
      <button w="full" @click="openNativePage" bg="$background">Native Page</button>
      <button w="full" class="w-full" @click="init()" bg="$background">Reload</button>
    </div>
    <div display="flex" align="items-stretch" w="full" flex="wrap">
      <ul w="[30%]">
        <ProjectCMP
          v-for="project in projects"
          :project="project"
          v-model:selected="repository.selectedProjectId_.value"
        />
      </ul>
      <div h="100%" border="right-[1px] dashed var(--primary)"></div>
      <ul flex="1">
        <TaskCMP
          v-for="task in repository.selectedProjectTasks_.value"
          :task="task"
          :selected="`${repository.selectedTaskId_.value}` === task.id"
        />
      </ul>
      <div h="100%" border="right-[1px] dashed var(--primary)"></div>
    </div>
  </div>
</template>

<style lang="sass" scoped></style>
