<script setup lang="ts">
import Main from './pages/Main.vue';
import Bar from './pages/Bar.vue';
import repository from './store'

let page = 'Main';


if (window.location.href.endsWith('bar')) {
  page = 'Bar';
} else {
}
</script>

<template>
  <Main v-if="page == 'Main'" />
  <Bar v-else />
</template>

<style lang="ts" setup>

</style>
