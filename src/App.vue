<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
</script>

<template>
  <div class="lg:h-screen lg:flex lg:flex-col">
    <AppHeader />

    <main>
      <RouterView />
    </main>
    <AppFooter class="lg:flex-shrink-0"/>
  </div>
</template>

<style scoped></style>
