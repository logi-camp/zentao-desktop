<script setup lang="ts">
import Main from './pages/Main.vue';
import Bar from './pages/Bar.vue';
import EffortDetail from './pages/EffortDetail.vue';

let page = 'Main';

if (location.hash.replace(/\#/g, '')) {
  page = location.hash.replace(/\#/g, '');
}


</script>

<template>
  <Main v-if="page == 'Main'" />
  <Bar v-if="page == 'bar'" />
  <EffortDetail v-if="page == 'working-task-dialog'" />
</template>

<style lang="ts" setup></style>
