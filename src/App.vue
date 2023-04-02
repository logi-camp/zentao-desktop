<script setup lang="ts">
import Main from './pages/Main.vue';
import Bar from './pages/Bar.vue';

let page = 'Main';

if (window.location.href.endsWith('bar') || location.hash == 'bar') {
  page = 'Bar';
}
</script>

<template>
  <Main v-if="page == 'Main'" />
  <Bar v-else />
</template>

<style lang="ts" setup></style>
