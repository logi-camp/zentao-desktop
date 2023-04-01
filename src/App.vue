<script setup lang="ts">
import { DefineComponent } from 'vue';
import Main from './pages/Main.vue';
import Bar from './pages/Bar.vue';

let page = 'Main';

console.log(window.location.href);
if (window.location.href.endsWith('bar')) {
  page = 'Bar';
} else {
}
</script>

<template>
  <Main v-if="page == 'Main'" />
  <Bar v-else />
</template>

<style></style>
