<script setup lang="ts">
import { Zentao12 } from '../../src/api';
import { Project, Task } from '../../src/api/types';
import { computed, reactive, watch } from 'vue';
import { ipcRenderer } from 'electron';
import TaskCMP from './Task.vue';
import ProjectCMP from './Project.vue';
import { repository } from '../store';

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg); // prints "pong"
});

const state = reactive<{
  projects?: Project[];
  selectedProjectId?: number;
  selectedTaskId?: number;
  tasks?: Task[];
}>({});

const zentao = new Zentao12({ url: 'https://zentao.logicamp.top', account: 'mohamad', password: 'thu6xeiR' });

const getTasks = async () => {
  const result = await zentao.getMyWorkTasks({});
  if (result.data?.locate) {
    ipcRenderer.send('open-login-window', 'ping');
  } else {
    console.log('tasks', result.data);
    repository.updateTasks(result.data?.tasks);
    state.tasks = result.data?.tasks;

    if (result.data) {
      state.tasks = Object.values(result.data.tasks);
    }
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

    if (result.data) {
      state.projects = [...Object.values(result.data.projects), { name: 'All', id: undefined }];
    }
  }

  await getTasks();

  console.log(state.projects);
};

ipcRenderer.on('select-project', (event, projectId?: number) => {
  console.log('select proj', projectId);
  state.selectedProjectId = projectId;
});

watch(state, ({ projects, selectedProjectId, tasks, selectedTaskId }) => {
  console.log('watch project');
  if (state.selectedProjectId) {
    tasks = tasks?.filter((task) => {
      return Number.parseInt(task.project) == state.selectedProjectId;
    });
  }
  ipcRenderer.send(
    'update-menu',
    JSON.parse(
      JSON.stringify({
        selectedProjectId,
        projects,
        tasks,
        selectedTaskId,
      })
    )
  );
});

init();

const openNativePage = () => {
  ipcRenderer.send('open-native-page-window', 'ok');
};

const selectedProjectTasks = computed(() => {
  if (state.selectedProjectId) {
    return state.tasks?.filter((task) => {
      return Number.parseInt(task.project) == state.selectedProjectId;
    });
  } else {
    return state.tasks;
  }
});
</script>

<template>
  <div h="full">
    <div class="header" display="flex" p="2" bg="$foreground" gap="1">
      <button w="full" @click="openNativePage" bg="$background">Native Page</button>
      <button w="full" class="w-full" @click="init()" bg="$background">Reload</button>
    </div>
    <div display="flex" align="items-stretch" w="full" flex="wrap">
      <ul w="[30%]">
        <ProjectCMP v-for="project in state.projects" :project="project" v-model:selected="state.selectedProjectId" />
      </ul>
      <div h="100%" border="right-[1px] dashed var(--primary)"></div>
      <ul flex="1">
        <TaskCMP
          v-for="task in selectedProjectTasks"
          :task="task"
          :selected="`${state.selectedTaskId}` === task.id"
          @select="state.selectedTaskId = task.id ? Number.parseInt(task.id) : undefined"
        />
      </ul>
      <div h="100%" border="right-[1px] dashed var(--primary)"></div>
    </div>
  </div>
</template>

<style lang="sass" scoped></style>
